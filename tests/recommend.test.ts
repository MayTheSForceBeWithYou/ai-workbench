import { describe, expect, it } from 'vitest';
import { allRecommendations, recommend } from '../src/lib/recommend.js';

describe('recommend', () => {
  it('routes implementation to claude-code', () => {
    expect(recommend('implementation').tool).toBe('claude-code');
  });

  it('routes refactor to cursor', () => {
    expect(recommend('refactor').tool).toBe('cursor');
  });

  it('routes boilerplate to github-copilot', () => {
    expect(recommend('boilerplate').tool).toBe('github-copilot');
  });

  it('routes architecture to chatgpt', () => {
    expect(recommend('architecture').tool).toBe('chatgpt');
  });

  it('routes debugging to chatgpt', () => {
    expect(recommend('debugging').tool).toBe('chatgpt');
  });

  it('routes docs to chatgpt', () => {
    expect(recommend('docs').tool).toBe('chatgpt');
  });

  it('routes review to chatgpt', () => {
    expect(recommend('review').tool).toBe('chatgpt');
  });

  it('returns a reason string for every type', () => {
    allRecommendations().forEach(({ reason }) => {
      expect(typeof reason).toBe('string');
      expect(reason.length).toBeGreaterThan(0);
    });
  });

  it('allRecommendations covers all 8 task types', () => {
    expect(allRecommendations()).toHaveLength(8);
  });
});
