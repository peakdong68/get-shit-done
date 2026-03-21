/**
 * GSD Milestone Summary Tests
 *
 * Validates the milestone-summary command and workflow files exist
 * and follow expected patterns. Tests artifact discovery logic.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const commandPath = path.join(repoRoot, 'commands', 'gsd', 'milestone-summary.md');
const workflowPath = path.join(repoRoot, 'get-shit-done', 'workflows', 'milestone-summary.md');

describe('milestone-summary command', () => {
  test('command file exists', () => {
    assert.ok(fs.existsSync(commandPath), 'commands/gsd/milestone-summary.md should exist');
  });

  test('command has correct frontmatter name', () => {
    const content = fs.readFileSync(commandPath, 'utf-8');
    assert.ok(content.includes('name: gsd:milestone-summary'), 'should have correct command name');
  });

  test('command references workflow in execution_context', () => {
    const content = fs.readFileSync(commandPath, 'utf-8');
    assert.ok(
      content.includes('workflows/milestone-summary.md'),
      'should reference the milestone-summary workflow'
    );
  });

  test('command accepts optional version argument', () => {
    const content = fs.readFileSync(commandPath, 'utf-8');
    assert.ok(content.includes('argument-hint'), 'should have argument-hint');
    assert.ok(content.includes('[version]'), 'version should be optional (bracketed)');
  });
});

describe('milestone-summary workflow', () => {
  test('workflow file exists', () => {
    assert.ok(fs.existsSync(workflowPath), 'workflows/milestone-summary.md should exist');
  });

  test('workflow reads milestone artifacts', () => {
    const content = fs.readFileSync(workflowPath, 'utf-8');
    const requiredArtifacts = [
      'ROADMAP.md',
      'REQUIREMENTS.md',
      'PROJECT.md',
      'SUMMARY.md',
      'VERIFICATION.md',
      'CONTEXT.md',
      'RETROSPECTIVE.md',
    ];
    for (const artifact of requiredArtifacts) {
      assert.ok(
        content.includes(artifact),
        `workflow should reference ${artifact}`
      );
    }
  });

  test('workflow writes to reports directory', () => {
    const content = fs.readFileSync(workflowPath, 'utf-8');
    assert.ok(
      content.includes('.planning/reports/MILESTONE_SUMMARY'),
      'should write summary to .planning/reports/'
    );
  });

  test('workflow has interactive Q&A mode', () => {
    const content = fs.readFileSync(workflowPath, 'utf-8');
    assert.ok(
      content.includes('Interactive Mode') || content.includes('ask anything'),
      'should offer interactive Q&A after summary'
    );
  });

  test('workflow handles both archived and current milestones', () => {
    const content = fs.readFileSync(workflowPath, 'utf-8');
    assert.ok(content.includes('Archived milestone'), 'should handle archived milestones');
    assert.ok(content.includes('Current') || content.includes('in-progress'), 'should handle current milestones');
  });

  test('workflow generates all 7 summary sections', () => {
    const content = fs.readFileSync(workflowPath, 'utf-8');
    const sections = [
      'Project Overview',
      'Architecture',
      'Phases Delivered',
      'Requirements Coverage',
      'Key Decisions',
      'Tech Debt',
      'Getting Started',
    ];
    for (const section of sections) {
      assert.ok(
        content.includes(section),
        `summary should include "${section}" section`
      );
    }
  });

  test('workflow updates STATE.md', () => {
    const content = fs.readFileSync(workflowPath, 'utf-8');
    assert.ok(
      content.includes('state record-session'),
      'should update STATE.md via gsd-tools'
    );
  });
});
