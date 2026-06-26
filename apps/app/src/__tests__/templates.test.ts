import { describe, it, expect } from 'vitest';
import footballTemplate from '../templates/football-template.json';
import athleticsTemplate from '../templates/athletics-template.json';
import type { CompetitionTemplate } from '../templates/types';

describe('Template System', () => {
  describe('Football Template', () => {
    it('should import football template without errors', () => {
      expect(footballTemplate).toBeDefined();
    });

    it('should have correct structure for football template', () => {
      const template = footballTemplate as CompetitionTemplate;
      
      expect(template.card_types).toBeInstanceOf(Array);
      expect(template.match_structure).toBeDefined();
      expect(template.action_types).toBeInstanceOf(Array);
    });

    it('should include yellow and red card types', () => {
      const template = footballTemplate as CompetitionTemplate;
      const cardIds = template.card_types.map(card => card.id);
      
      expect(cardIds).toContain('yellow');
      expect(cardIds).toContain('red');
    });

    it('should have correct card type properties', () => {
      const template = footballTemplate as CompetitionTemplate;
      const yellowCard = template.card_types.find(card => card.id === 'yellow');
      
      expect(yellowCard).toBeDefined();
      expect(yellowCard?.name).toBe('Yellow Card');
      expect(yellowCard?.color).toBe('#FFFF00');
      expect(yellowCard?.display_duration).toBe(5000);
    });

    it('should have football match structure', () => {
      const template = footballTemplate as CompetitionTemplate;
      const matchStructure = template.match_structure;
      
      expect(matchStructure).toBeDefined();
      if (matchStructure && 'type' in matchStructure) {
        expect(matchStructure.type).toBe('halves');
      }
    });

    it('should include goal, substitution, and card_log action types', () => {
      const template = footballTemplate as CompetitionTemplate;
      const actionIds = template.action_types.map(action => action.id);
      
      expect(actionIds).toContain('goal');
      expect(actionIds).toContain('substitution');
      expect(actionIds).toContain('card_log');
    });

    it('should have correct field definitions for goal action', () => {
      const template = footballTemplate as CompetitionTemplate;
      const goalAction = template.action_types.find(action => action.id === 'goal');
      
      expect(goalAction).toBeDefined();
      expect(goalAction?.fields).toBeInstanceOf(Array);
      
      const fieldNames = goalAction?.fields.map(field => field.name) || [];
      expect(fieldNames).toContain('scorer_id');
      expect(fieldNames).toContain('assistant_id');
      expect(fieldNames).toContain('minute');
      expect(fieldNames).toContain('team');
    });

    it('should have required fields marked correctly', () => {
      const template = footballTemplate as CompetitionTemplate;
      const goalAction = template.action_types.find(action => action.id === 'goal');
      
      const scorerField = goalAction?.fields.find(field => field.name === 'scorer_id');
      const assistantField = goalAction?.fields.find(field => field.name === 'assistant_id');
      
      expect(scorerField?.required).toBe(true);
      expect(assistantField?.required).toBe(false);
    });
  });

  describe('Athletics Template', () => {
    it('should import athletics template without errors', () => {
      expect(athleticsTemplate).toBeDefined();
    });

    it('should have correct structure for athletics template', () => {
      const template = athleticsTemplate as CompetitionTemplate;
      
      expect(template.card_types).toBeInstanceOf(Array);
      expect(template.match_structure).toBeDefined();
      expect(template.action_types).toBeInstanceOf(Array);
    });

    it('should include yellow and red card types', () => {
      const template = athleticsTemplate as CompetitionTemplate;
      const cardIds = template.card_types.map(card => card.id);
      
      expect(cardIds).toContain('yellow');
      expect(cardIds).toContain('red');
    });

    it('should have athletics match structure', () => {
      const template = athleticsTemplate as CompetitionTemplate;
      const matchStructure = template.match_structure;
      
      expect(matchStructure).toBeDefined();
      if (matchStructure && 'type' in matchStructure) {
        expect(matchStructure.type).toBe('events');
      }
    });

    it('should include track and field disciplines', () => {
      const template = athleticsTemplate as CompetitionTemplate;
      const matchStructure = template.match_structure;
      
      if (matchStructure && 'disciplines' in matchStructure) {
        expect(matchStructure.disciplines).toContain('track');
        expect(matchStructure.disciplines).toContain('field');
      }
    });

    it('should include false_start and lane_infringement action types', () => {
      const template = athleticsTemplate as CompetitionTemplate;
      const actionIds = template.action_types.map(action => action.id);
      
      expect(actionIds).toContain('false_start');
      expect(actionIds).toContain('lane_infringement');
    });

    it('should have correct field definitions for false_start action', () => {
      const template = athleticsTemplate as CompetitionTemplate;
      const falseStartAction = template.action_types.find(action => action.id === 'false_start');
      
      expect(falseStartAction).toBeDefined();
      expect(falseStartAction?.fields).toBeInstanceOf(Array);
      
      const fieldNames = falseStartAction?.fields.map(field => field.name) || [];
      expect(fieldNames).toContain('athlete_id');
      expect(fieldNames).toContain('lane_number');
      expect(fieldNames).toContain('heat_number');
      expect(fieldNames).toContain('notes');
    });

    it('should have correct field types', () => {
      const template = athleticsTemplate as CompetitionTemplate;
      const falseStartAction = template.action_types.find(action => action.id === 'false_start');
      
      const athleteField = falseStartAction?.fields.find(field => field.name === 'athlete_id');
      const laneField = falseStartAction?.fields.find(field => field.name === 'lane_number');
      
      expect(athleteField?.type).toBe('text');
      expect(laneField?.type).toBe('number');
    });
  });

  describe('Type Safety', () => {
    it('should infer TypeScript types correctly from JSON', () => {
      const template = footballTemplate as CompetitionTemplate;
      
      expect(typeof template.card_types).toBe('object');
      expect(typeof template.match_structure).toBe('object');
      expect(typeof template.action_types).toBe('object');
    });

    it('should have correct types for card properties', () => {
      const template = footballTemplate as CompetitionTemplate;
      const card = template.card_types[0];
      
      expect(typeof card.id).toBe('string');
      expect(typeof card.name).toBe('string');
      expect(typeof card.color).toBe('string');
      expect(typeof card.display_duration).toBe('number');
    });

    it('should have correct types for action field properties', () => {
      const template = footballTemplate as CompetitionTemplate;
      const action = template.action_types[0];
      const field = action.fields[0];
      
      expect(typeof field.name).toBe('string');
      expect(typeof field.label).toBe('string');
      expect(typeof field.description).toBe('string');
      expect(typeof field.placeholder).toBe('string');
      expect(typeof field.type).toBe('string');
      expect(typeof field.required).toBe('boolean');
    });
  });
});
