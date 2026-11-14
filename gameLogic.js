/**
 * MARSBOUND - Core Game Logic
 * NASA Space Apps Challenge 2026
 *
 * Rules:
 * 1. Initial Resources: Oxygen: 100, Water: 100, Food: 100, Energy: 100. Sol 1 of 10.
 * 2. Actions:
 *    - Improve Radiation Shielding: Energy -15, Oxygen +5
 *    - Expand Greenhouse: Water -15, Energy -10, Food +25
 *    - Conserve Energy: Energy +20, Food -5
 *    - Activate Water Recycling: Water +25, Energy -15 (Disabled if Energy < 15)
 * 3. Daily Decay after action: Oxygen -5, Water -5, Food -5. Sol advances by 1.
 * 4. All resources clamped between 0 and 100.
 * 5. If any resource <= 0: Mission Failure.
 * 6. Exactly 10 decisions complete the 10-Sol mission:
 *    Sol 1 (Turn 1) -> Sol 10 (Turn 10).
 */

export const INITIAL_RESOURCES = {
  oxygen: 100,
  water: 100,
  food: 100,
  energy: 100
};

export const MAX_SOLS = 10;

export const SURVIVAL_THRESHOLDS = {
  oxygen: 35,
  water: 35,
  food: 30,
  energy: 25
};

export const DAILY_DECAY = {
  oxygen: 5,
  water: 5,
  food: 5,
  energy: 0
};

export const DECISIONS = {
  shielding: {
    id: 'shielding',
    title: 'Improve Radiation Shielding',
    icon: '🛡️',
    description: 'Diverts power to active magnetic shields, improving habitat life-support efficiency.',
    actionEffects: {
      energy: -15,
      oxygen: 5,
      water: 0,
      food: 0
    },
    netEffects: {
      energy: -15,
      oxygen: 0, // +5 - 5
      water: -5,
      food: -5
    },
    impacts: [
      { resource: 'Oxygen', icon: '🫧', action: '+5', daily: '-5', net: 0, netText: '0', type: 'neutral' },
      { resource: 'Water',  icon: '💧', action: '—',  daily: '-5', net: -5, netText: '-5', type: 'negative' },
      { resource: 'Food',   icon: '🍎', action: '—',  daily: '-5', net: -5, netText: '-5', type: 'negative' },
      { resource: 'Energy', icon: '⚡', action: '-15', daily: '—', net: -15, netText: '-15', type: 'negative' }
    ],
    explanation: 'Costs 15 Energy. Adds +5 Oxygen efficiency, neutralizing the daily 5 Oxygen consumption.'
  },
  greenhouse: {
    id: 'greenhouse',
    title: 'Expand Greenhouse',
    icon: '🌱',
    description: 'Deploys hydroponic farming trays to grow nutritious Martian crops.',
    actionEffects: {
      water: -15,
      energy: -10,
      food: 25,
      oxygen: 0
    },
    netEffects: {
      water: -20, // -15 - 5
      energy: -10,
      food: 20, // +25 - 5
      oxygen: -5
    },
    impacts: [
      { resource: 'Oxygen', icon: '🫧', action: '—',  daily: '-5', net: -5, netText: '-5', type: 'negative' },
      { resource: 'Water',  icon: '💧', action: '-15', daily: '-5', net: -20, netText: '-20', type: 'negative' },
      { resource: 'Food',   icon: '🍎', action: '+25', daily: '-5', net: 20, netText: '+20', type: 'positive' },
      { resource: 'Energy', icon: '⚡', action: '-10', daily: '—', net: -10, netText: '-10', type: 'negative' }
    ],
    explanation: 'Costs 15 Water and 10 Energy. Yields +25 Food (net +20 Food after daily consumption).'
  },
  conserve: {
    id: 'conserve',
    title: 'Conserve Energy',
    icon: '⚡',
    description: 'Dimmers auxiliary lighting and cycles battery storage banks to restore power.',
    actionEffects: {
      energy: 20,
      food: -5,
      oxygen: 0,
      water: 0
    },
    netEffects: {
      energy: 20,
      food: -10, // -5 - 5
      oxygen: -5,
      water: -5
    },
    impacts: [
      { resource: 'Oxygen', icon: '🫧', action: '—',  daily: '-5', net: -5, netText: '-5', type: 'negative' },
      { resource: 'Water',  icon: '💧', action: '—',  daily: '-5', net: -5, netText: '-5', type: 'negative' },
      { resource: 'Food',   icon: '🍎', action: '-5',  daily: '-5', net: -10, netText: '-10', type: 'negative' },
      { resource: 'Energy', icon: '⚡', action: '+20', daily: '—', net: 20, netText: '+20', type: 'positive' }
    ],
    explanation: 'Restores +20 Energy. Rations decrease Food by 5 (net -10 Food after daily consumption).'
  },
  recycling: {
    id: 'recycling',
    title: 'Activate Water Recycling',
    icon: '💧',
    description: 'Recover water from wastewater and moisture collected inside the habitat.',
    actionEffects: {
      energy: -15,
      water: 25,
      oxygen: 0,
      food: 0
    },
    netEffects: {
      energy: -15,
      water: 20, // +25 - 5
      oxygen: -5,
      food: -5
    },
    minEnergyRequired: 15,
    requirements: {
      energy: 15
    },
    impacts: [
      { resource: 'Oxygen', icon: '🫧', action: '—',  daily: '-5', net: -5, netText: '-5', type: 'negative' },
      { resource: 'Water',  icon: '💧', action: '+25', daily: '-5', net: 20, netText: '+20', type: 'positive' },
      { resource: 'Food',   icon: '🍎', action: '—',  daily: '-5', net: -5, netText: '-5', type: 'negative' },
      { resource: 'Energy', icon: '⚡', action: '-15', daily: '—', net: -15, netText: '-15', type: 'negative' }
    ],
    explanation: 'Engages reclamation filters to recover +25 Water from habitat wastewater and atmospheric condensation. Consumes 15 Energy.'
  },
  oxygen_generator: {
    id: 'oxygen_generator',
    title: 'Activate Oxygen Generator',
    icon: '🫧',
    description: 'Use an electrolysis system to split recovered water into oxygen for the habitat.',
    actionEffects: {
      oxygen: 25,
      water: -10,
      energy: -15,
      food: 0
    },
    netEffects: {
      oxygen: 20, // +25 - 5
      water: -15, // -10 - 5
      food: -5,   // 0 - 5
      energy: -15 // -15 - 0
    },
    requirements: {
      water: 10,
      energy: 15
    },
    impacts: [
      { resource: 'Oxygen', icon: '🫧', action: '+25', daily: '-5', net: 20, netText: '+20', type: 'positive' },
      { resource: 'Water',  icon: '💧', action: '-10', daily: '-5', net: -15, netText: '-15', type: 'negative' },
      { resource: 'Food',   icon: '🍎', action: '—',   daily: '-5', net: -5, netText: '-5', type: 'negative' },
      { resource: 'Energy', icon: '⚡', action: '-15', daily: '—', net: -15, netText: '-15', type: 'negative' }
    ],
    explanation: 'Uses electrolysis to split water into +25 Oxygen (net +20). Consumes 10 Water and 15 Energy.'
  }
};

export const RANDOM_EVENTS = {
  dust_storm: {
    id: 'dust_storm',
    title: 'Severe Dust Storm',
    icon: '🌪️',
    type: 'Emergency',
    typeClass: 'emergency',
    effects: {
      energy: -20,
      water: 0,
      food: 0,
      oxygen: 0
    },
    impactSummary: 'Energy -20',
    message:
      'A severe dust storm is affecting the habitat. Dust accumulation has reduced solar panel output, causing energy reserves to drop.'
  },
  water_leak: {
    id: 'water_leak',
    title: 'Water System Leak',
    icon: '💧',
    type: 'Warning',
    typeClass: 'warning',
    effects: {
      water: -15,
      energy: 0,
      food: 0,
      oxygen: 0
    },
    impactSummary: 'Water -15',
    message:
      "A leak has been detected in the habitat's water distribution system. Water reserves have decreased."
  },
  solar_surge: {
    id: 'solar_surge',
    title: 'Solar Power Surge',
    icon: '☀️',
    type: 'Positive event',
    typeClass: 'positive',
    effects: {
      energy: 15,
      water: 0,
      food: 0,
      oxygen: 0
    },
    impactSummary: 'Energy +15',
    message:
      'Solar power generation has temporarily improved, increasing available energy reserves.'
  }
};

/**
 * Clamps a resource value strictly between 0 and 100.
 */
export function clamp(val) {
  return Math.max(0, Math.min(100, Math.round(val)));
}

/**
 * Calculates the next state after executing a decision on a specific Sol,
 * and rolls for a random Mars event (30% chance).
 *
 * @param {Object} currentResources - { oxygen, water, food, energy }
 * @param {number} currentSol - current sol being played (1 to 10)
 * @param {string} decisionId - 'shielding' | 'greenhouse' | 'conserve' | 'recycling' | 'oxygen_generator'
 * @param {string|null} [forcedEventId] - optional event ID or 'none' for testing
 * @returns {Object} { nextResources, nextSol, completedTurns, outcome, depletedResources, actionLog, event }
 */
export function processTurn(currentResources, currentSol, decisionId, forcedEventId = null) {
  const decision = DECISIONS[decisionId];
  if (!decision) {
    throw new Error(`Unknown decision ID: ${decisionId}`);
  }

  // Enforce resource requirements (e.g. Energy or Water minimums)
  if (decision.requirements) {
    if (decision.requirements.energy && currentResources.energy < decision.requirements.energy) {
      throw new Error(
        `Insufficient Energy to execute ${decision.title}. Requires ${decision.requirements.energy} Energy, but only ${currentResources.energy} is available.`
      );
    }
    if (decision.requirements.water && currentResources.water < decision.requirements.water) {
      throw new Error(
        `Insufficient Water to execute ${decision.title}. Requires ${decision.requirements.water} Water, but only ${currentResources.water} is available.`
      );
    }
  } else if (decision.minEnergyRequired && currentResources.energy < decision.minEnergyRequired) {
    throw new Error(
      `Insufficient Energy to execute ${decision.title}. Requires ${decision.minEnergyRequired} Energy, but only ${currentResources.energy} is available.`
    );
  }

  // 1. Apply the direct effects of the selected decision:
  let o2 = currentResources.oxygen + decision.actionEffects.oxygen;
  let h2o = currentResources.water + decision.actionEffects.water;
  let food = currentResources.food + decision.actionEffects.food;
  let energy = currentResources.energy + decision.actionEffects.energy;

  // 2. Apply daily consumption:
  o2 -= DAILY_DECAY.oxygen;
  h2o -= DAILY_DECAY.water;
  food -= DAILY_DECAY.food;
  energy -= DAILY_DECAY.energy;

  // Capture resource values immediately before the random event (within 0–100 limits):
  const preEventClamped = {
    oxygen: clamp(o2),
    water: clamp(h2o),
    food: clamp(food),
    energy: clamp(energy)
  };

  // 3. Generate a random event with 30% probability:
  let triggeredEvent = null;
  if (forcedEventId !== null) {
    if (forcedEventId !== 'none' && RANDOM_EVENTS[forcedEventId]) {
      triggeredEvent = {
        ...RANDOM_EVENTS[forcedEventId],
        effects: { ...RANDOM_EVENTS[forcedEventId].effects },
        sol: currentSol,
        instanceId: `${forcedEventId}-${currentSol}-${Date.now()}`
      };
    }
  } else {
    const roll = Math.random();
    if (roll < 0.3) {
      let eligibleKeys = Object.keys(RANDOM_EVENTS);
      // Water-replenishment rule: If a decision directly increases Water, exclude Water System Leak
      if (decision.actionEffects && decision.actionEffects.water > 0) {
        eligibleKeys = eligibleKeys.filter((key) => key !== 'water_leak');
      }
      const chosenKey = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
      triggeredEvent = {
        ...RANDOM_EVENTS[chosenKey],
        effects: { ...RANDOM_EVENTS[chosenKey].effects },
        sol: currentSol,
        instanceId: `${chosenKey}-${currentSol}-${Date.now()}-${Math.random()}`
      };
    }
  }

  // 4. If an event occurs, apply its effect exactly once:
  if (triggeredEvent) {
    // Calculate the event's effective impact:
    // - Capture resource values immediately before applying the random event (preEventClamped)
    // - Apply the event effect using the existing event logic
    // - Apply the existing 0–100 resource limits
    // - Calculate the actual difference caused by the event alone
    const postEventAlone = {
      oxygen: clamp(preEventClamped.oxygen + triggeredEvent.effects.oxygen),
      water: clamp(preEventClamped.water + triggeredEvent.effects.water),
      food: clamp(preEventClamped.food + triggeredEvent.effects.food),
      energy: clamp(preEventClamped.energy + triggeredEvent.effects.energy)
    };

    const effectiveDiff = {
      oxygen: postEventAlone.oxygen - preEventClamped.oxygen,
      water: postEventAlone.water - preEventClamped.water,
      food: postEventAlone.food - preEventClamped.food,
      energy: postEventAlone.energy - preEventClamped.energy
    };

    const formatSigned = (val) => (val > 0 ? `+${val}` : val === 0 ? '+0' : `${val}`);

    const impactParts = [];
    for (const [resKey, intendedEffect] of Object.entries(triggeredEvent.effects)) {
      if (intendedEffect !== 0) {
        const resName = resKey.charAt(0).toUpperCase() + resKey.slice(1);
        impactParts.push(`${resName} ${formatSigned(effectiveDiff[resKey])}`);
      }
    }

    triggeredEvent.effectiveDiff = effectiveDiff;
    triggeredEvent.impactSummary = impactParts.length > 0 ? impactParts.join(', ') : 'None';

    // Apply event effects to turn accumulators:
    o2 += triggeredEvent.effects.oxygen;
    h2o += triggeredEvent.effects.water;
    food += triggeredEvent.effects.food;
    energy += triggeredEvent.effects.energy;
  }

  // 5. Clamp all resources between 0 and 100:
  const finalResources = {
    oxygen: clamp(o2),
    water: clamp(h2o),
    food: clamp(food),
    energy: clamp(energy)
  };

  // 6. Check mission failure and success conditions:
  const depleted = [];
  if (finalResources.oxygen <= 0) depleted.push('Oxygen');
  if (finalResources.water <= 0) depleted.push('Water');
  if (finalResources.food <= 0) depleted.push('Food');
  if (finalResources.energy <= 0) depleted.push('Energy');

  let outcome = null; // null | 'failure' | 'success'
  let failureReason = null; // null | 'depletion' | 'threshold'
  let thresholdFailures = []; // array of { resource, icon, current, required }
  let nextSol = currentSol;
  const completedTurns = currentSol;

  if (depleted.length > 0) {
    // Depletion to 0 produces immediate failure
    outcome = 'failure';
    failureReason = 'depletion';
    nextSol = currentSol;
  } else if (currentSol >= MAX_SOLS) {
    // 10 Sols completed: check Mission Survival Thresholds
    if (finalResources.oxygen < SURVIVAL_THRESHOLDS.oxygen) {
      thresholdFailures.push({
        resource: 'Oxygen',
        icon: '🫧',
        current: finalResources.oxygen,
        required: SURVIVAL_THRESHOLDS.oxygen
      });
    }
    if (finalResources.water < SURVIVAL_THRESHOLDS.water) {
      thresholdFailures.push({
        resource: 'Water',
        icon: '💧',
        current: finalResources.water,
        required: SURVIVAL_THRESHOLDS.water
      });
    }
    if (finalResources.food < SURVIVAL_THRESHOLDS.food) {
      thresholdFailures.push({
        resource: 'Food',
        icon: '🍎',
        current: finalResources.food,
        required: SURVIVAL_THRESHOLDS.food
      });
    }
    if (finalResources.energy < SURVIVAL_THRESHOLDS.energy) {
      thresholdFailures.push({
        resource: 'Energy',
        icon: '⚡',
        current: finalResources.energy,
        required: SURVIVAL_THRESHOLDS.energy
      });
    }

    if (thresholdFailures.length > 0) {
      outcome = 'failure';
      failureReason = 'threshold';
      nextSol = MAX_SOLS;
    } else {
      outcome = 'success';
      failureReason = null;
      nextSol = MAX_SOLS;
    }
  } else {
    outcome = null;
    failureReason = null;
    nextSol = currentSol + 1;
  }

  // Calculate actual net changes for the turn:
  const netChanges = {
    oxygen: finalResources.oxygen - currentResources.oxygen,
    water: finalResources.water - currentResources.water,
    food: finalResources.food - currentResources.food,
    energy: finalResources.energy - currentResources.energy
  };

  const formatDelta = (val) => (val > 0 ? `+${val}` : `${val}`);
  const netSummary = `Net: O2 ${formatDelta(netChanges.oxygen)}, H2O ${formatDelta(netChanges.water)}, Food ${formatDelta(netChanges.food)}, Energy ${formatDelta(netChanges.energy)}`;

  const actionLog = {
    sol: currentSol,
    decisionTitle: decision.title,
    explanation: decision.explanation,
    netChanges,
    summary: triggeredEvent
      ? `Sol ${currentSol}: Executed "${decision.title}". Daily consumption applied. Event: ${triggeredEvent.title} (${triggeredEvent.impactSummary}). ${netSummary}.`
      : `Sol ${currentSol}: Executed "${decision.title}". Daily consumption applied. ${netSummary}.`
  };

  return {
    nextResources: finalResources,
    nextSol,
    completedTurns,
    outcome,
    failureReason,
    depletedResources: depleted,
    thresholdFailures,
    actionLog,
    event: triggeredEvent
  };
}
