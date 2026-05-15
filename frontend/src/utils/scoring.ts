import { ResourceZone, PriorityScore } from '../types/resources';
import { SCORE_LEVELS } from '../config/constants';

export function calculatePriorityScore(zone: ResourceZone): PriorityScore {
  const maxPop = 5000;
  const maxInc = 20;
  const pop_norm = zone.pop_density / maxPop;
  const inc_norm = zone.incidents / maxInc;

  const score =
    pop_norm * 0.3 +
    inc_norm * 0.4 +
    zone.weather_risk * 0.2 +
    zone.vulnerability * 0.1;

  const clamped = Math.min(1, Math.max(0, score));
  let level: PriorityScore['level'] = 'normal';
  if (clamped >= SCORE_LEVELS.critical.min) level = 'critical';
  else if (clamped >= SCORE_LEVELS.warning.min) level = 'warning';

  return { zoneId: zone.id, score: clamped, level };
}

export function getZoneColor(level: PriorityScore['level']) {
  return SCORE_LEVELS[level].color;
}