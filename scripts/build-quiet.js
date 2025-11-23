const { spawn } = require('child_process');
const path = require('path');

const isProdBuild = process.env.VERCEL || process.env.NODE_ENV === 'production';

// Patterns to suppress in production builds (verbose progress logs)
// We suppress intermediate progress but keep final summaries
const suppressPatterns = [
  /^   Collecting page data using \d+ workers/,
  /^Route \(app\)/,
  /^┌|^├|^└|^│/,
  /^   ○|^   ●/,
  /^   \[.*more paths\]/,
  /^   Creating an optimized production build/,
  /^   Running TypeScript/,
  /^   Finalizing page optimization/,
  /^   ▲ Next\.js/,
];

// Patterns for final summaries we want to keep
const finalSummaryPatterns = [
  /✓ Compiled successfully/,
  /✓ Generating static pages.*\(\d+\/\d+\) in/,  // Final completion line
];

// Patterns for intermediate progress we want to suppress
const intermediateProgressPatterns = [
  /^   Generating static pages using \d+ workers \(\d+\/\d+\)\s*\.\.\.\s*$/,  // With "..."
  /^   Generating static pages using \d+ workers \(\d+\/\d+\)\s*$/,  // Exact match, no "in X.Xs"
  /^   Generating static pages using \d+ workers \(\d+\/\d+\)\s+$/,  // With trailing whitespace
];

// Patterns to always keep (errors, warnings, summaries)
const keepPatterns = [
  /ERROR|Error|error/,
  /WARN|Warning|warning/,
  /Failed|failed/,
  /✅|❌/,
  /Sitemap:|Validation/,
  /Build error|Build failed/,
  /Type error/,
];

function shouldKeepLine(line) {
  const trimmed = line.trim();
  
  // Always keep error/warning lines
  if (keepPatterns.some(pattern => pattern.test(line))) {
    return true;
  }
  
  // Always keep final summaries (even in production)
  if (finalSummaryPatterns.some(pattern => pattern.test(line))) {
    return true;
  }
  
  // In production, suppress verbose progress logs
  if (isProdBuild) {
    // Suppress intermediate "Generating static pages" progress (without "in X.Xs")
    if (intermediateProgressPatterns.some(pattern => pattern.test(line))) {
      return false;
    }
    
    // Suppress other verbose patterns
    if (suppressPatterns.some(pattern => pattern.test(line))) {
      return false;
    }
    
    // Suppress empty lines and tree structure in production
    if (trimmed === '' || /^[┌├└│○●]/.test(trimmed)) {
      return false;
    }
  }
  
  // Keep everything else (or in dev, keep everything)
  return true;
}

// Run next build with filtered output
const nextBuild = spawn('next', ['build'], {
  cwd: path.join(__dirname, '..'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
});

let stdoutBuffer = '';
let stderrBuffer = '';

nextBuild.stdout.on('data', (data) => {
  stdoutBuffer += data.toString();
  const lines = stdoutBuffer.split('\n');
  stdoutBuffer = lines.pop() || ''; // Keep incomplete line in buffer
  
  lines.forEach(line => {
    if (shouldKeepLine(line)) {
      process.stdout.write(line + '\n');
    }
  });
});

nextBuild.stderr.on('data', (data) => {
  stderrBuffer += data.toString();
  const lines = stderrBuffer.split('\n');
  stderrBuffer = lines.pop() || ''; // Keep incomplete line in buffer
  
  lines.forEach(line => {
    if (shouldKeepLine(line)) {
      process.stderr.write(line + '\n');
    }
  });
});

nextBuild.on('close', (code) => {
  // Flush remaining buffers
  if (stdoutBuffer && shouldKeepLine(stdoutBuffer)) {
    process.stdout.write(stdoutBuffer);
  }
  if (stderrBuffer && shouldKeepLine(stderrBuffer)) {
    process.stderr.write(stderrBuffer);
  }
  
  process.exit(code || 0);
});

nextBuild.on('error', (error) => {
  console.error('Failed to start next build:', error);
  process.exit(1);
});

