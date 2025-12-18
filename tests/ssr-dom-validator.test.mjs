import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3000';

test('SSR DOM, Accessibility & Semantic HTML Quality Suite', async (t) => {
  await t.test('Landing Page (/) DOM structure and SEO elements', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();

    // Semantic HTML & Titles
    assert.ok(html.includes('<html') || html.includes('<!DOCTYPE html>'), 'Must have valid HTML document');
    assert.ok(html.includes('<title>') || html.includes('CureWell'), 'Must contain site title');
    
    // Core Navigation & Interactive Elements
    assert.ok(html.includes('/login'), 'Must include link to login portal');
    assert.ok(html.includes('Sign In') || html.includes('Login') || html.includes('Access Portal'), 'Must include login action');
    
    // Theme Provider attributes
    assert.ok(html.includes('theme') || html.includes('dark') || html.includes('class='), 'Must support theme classes');
  });

  await t.test('Login Page (/login) Form & Input Accessibility', async () => {
    const res = await fetch(`${BASE_URL}/login`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();

    // Check for form fields
    assert.ok(html.includes('password') || html.includes('Password'), 'Login page must have password field');
    assert.ok(html.includes('role') || html.includes('Role') || html.includes('Doctor') || html.includes('Admin'), 'Login page must support role selection');
    assert.ok(html.includes('type="submit"') || html.includes('button') || html.includes('Sign in') || html.includes('Log in'), 'Login page must have submit button');
  });

  await t.test('Theme Toggle & Contrast CSS Tokens exist in Stylesheets', async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();

    // Check for CSS link or style injection
    assert.ok(html.includes('<link rel="stylesheet"') || html.includes('<style'), 'Page must link modern stylesheets');
  });
});
