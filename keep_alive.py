"""
Oracle Autonomous Database Keep-Alive Script
============================================
Safely connects to Oracle Cloud Autonomous Database using in-memory / temporary
wallet extraction, executes a lightweight read-only ping query (SELECT 1 FROM DUAL),
and updates the database activity timestamp to prevent inactivity shutdowns.

Security & Isolation:
- Zero credential logging / leakage
- Wallet zip decoded dynamically into an ephemeral TemporaryDirectory
- All decrypted wallet artifacts securely wiped when context exits
- Thin mode connectivity via python-oracledb
"""

import os
import sys
import base64
import io
import time
import zipfile
import tempfile
from datetime import datetime, timezone

try:
    import oracledb
except ImportError:
    print("Error: 'oracledb' package is not installed. Run: pip install oracledb", file=sys.stderr)
    sys.exit(1)


def get_required_env(var_name: str) -> str:
    """Retrieve required environment variable or exit safely."""
    value = os.environ.get(var_name, "").strip()
    if not value:
        print(f"[SECURITY/CONFIG ERROR] Missing required environment variable: {var_name}", file=sys.stderr)
        sys.exit(1)
    return value


def mask_identifier(val: str) -> str:
    """Safely mask string for diagnostic logging without exposing full identity."""
    if len(val) <= 4:
        return "****"
    return f"{val[:2]}****{val[-2:]}"


def run_keep_alive() -> None:
    start_time = time.perf_counter()
    timestamp_iso = datetime.now(timezone.utc).isoformat()
    print(f"[{timestamp_iso}] Starting Oracle Autonomous Database Keep-Alive ping...")

    # 1. Validate and fetch required credentials from environment
    oracle_user = get_required_env("ORACLE_USER")
    oracle_password = get_required_env("ORACLE_PASSWORD")
    oracle_wallet_base64 = get_required_env("ORACLE_WALLET_BASE64")
    oracle_wallet_password = get_required_env("ORACLE_WALLET_PASSWORD")
    oracle_tns_name = get_required_env("ORACLE_TNS_NAME")

    print(f"[{datetime.now(timezone.utc).isoformat()}] Validated environment configuration.")
    print(f"  Target User: {mask_identifier(oracle_user)}")
    print(f"  TNS Alias  : {oracle_tns_name}")

    # 2. Ephemeral Temporary Directory for Wallet extraction
    with tempfile.TemporaryDirectory(prefix="ora_wallet_") as temp_wallet_dir:
        try:
            # Decode Base64 wallet in memory
            wallet_bytes = base64.b64decode(oracle_wallet_base64)
            with zipfile.ZipFile(io.BytesIO(wallet_bytes)) as zf:
                zf.extractall(temp_wallet_dir)
            print(f"[{datetime.now(timezone.utc).isoformat()}] Ephemeral wallet extracted to secure runtime sandbox.")
        except Exception as e:
            print(f"[ERROR] Failed to decode and extract Oracle Wallet payload: {type(e).__name__}", file=sys.stderr)
            sys.exit(1)

        # 3. Connect to Oracle Autonomous Database in Thin Mode
        connection = None
        cursor = None
        try:
            connect_start = time.perf_counter()
            connection = oracledb.connect(
                user=oracle_user,
                password=oracle_password,
                dsn=oracle_tns_name,
                config_dir=temp_wallet_dir,
                wallet_location=temp_wallet_dir,
                wallet_password=oracle_wallet_password
            )
            connect_duration = (time.perf_counter() - connect_start) * 1000
            print(f"[{datetime.now(timezone.utc).isoformat()}] Connection established successfully ({connect_duration:.1f}ms).")

            # 4. Execute strictly read-only keep-alive query
            cursor = connection.cursor()
            query_start = time.perf_counter()
            cursor.execute("SELECT 1 FROM DUAL")
            result = cursor.fetchone()
            query_duration = (time.perf_counter() - query_start) * 1000

            if result and result[0] == 1:
                total_duration = (time.perf_counter() - start_time) * 1000
                print(f"[{datetime.now(timezone.utc).isoformat()}] Query Verification: SUCCESS (SELECT 1 -> {result[0]})")
                print(f"[{datetime.now(timezone.utc).isoformat()}] Keep-Alive Cycle Completed Successfully in {total_duration:.1f}ms (Query: {query_duration:.1f}ms).")
                print(f"[{datetime.now(timezone.utc).isoformat()}] Autonomous Database activity counter refreshed.")
            else:
                print(f"[WARNING] Query returned unexpected result: {result}", file=sys.stderr)
                sys.exit(1)

        except oracledb.DatabaseError as db_err:
            error_obj, = db_err.args
            print(f"[DATABASE ERROR] Oracle Code: {getattr(error_obj, 'code', 'UNKNOWN')}", file=sys.stderr)
            print(f"[DATABASE ERROR] Message    : {getattr(error_obj, 'message', str(db_err))}", file=sys.stderr)
            sys.exit(1)
        except Exception as err:
            print(f"[RUNTIME ERROR] Connection failed: {type(err).__name__} - {str(err)}", file=sys.stderr)
            sys.exit(1)
        finally:
            if cursor:
                try:
                    cursor.close()
                except Exception:
                    pass
            if connection:
                try:
                    connection.close()
                    print(f"[{datetime.now(timezone.utc).isoformat()}] Database connection closed gracefully.")
                except Exception:
                    pass

    # Ephemeral directory is destroyed here automatically
    print(f"[{datetime.now(timezone.utc).isoformat()}] Ephemeral wallet sandbox destroyed.")


if __name__ == "__main__":
    run_keep_alive()
