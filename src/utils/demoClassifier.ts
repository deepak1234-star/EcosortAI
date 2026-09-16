import type { DemoClassification, WasteScan, WasteCategoryType } from '../types';
import { classifyImageWithNeuralNet } from './aiVisionModel';

export const CATEGORY_PRESETS: Record<WasteCategoryType, { name: string; type: string; actions: string[] }> = {
  Organic: {
    name: 'Organic Food & Plant Waste',
    type: 'Organic Compostable',
    actions: [
      'Place in green organic or compost bin.',
      'Keep separate from plastic bags, synthetic wrappers, and inorganic recyclables.',
      'Suitable for community composting or municipal wet-waste processing.'
    ]
  },
  Plastic: {
    name: 'Plastic Material / Packaging',
    type: 'Recyclable Plastic',
    actions: [
      'Empty and rinse out food or liquid residues.',
      'Keep clean and dry before recycling.',
      'Place into local dry recyclables stream according to PET/HDPE resin codes.'
    ]
  },
  Paper: {
    name: 'Paper & Cardboard Waste',
    type: 'Paperboard / Fiber',
    actions: [
      'Flatten cardboard boxes to save bin space.',
      'Keep dry and free from oil or grease contamination.',
      'Deposit into designated paper recycling bin.'
    ]
  },
  Metal: {
    name: 'Metal Can / Container',
    type: 'Aluminum / Steel',
    actions: [
      'Rinse food or beverage residue clean.',
      'Crush metal cans if possible to optimize capacity.',
      'Place in dry metal recycling container.'
    ]
  },
  Glass: {
    name: 'Glass Container / Bottle',
    type: 'Glass Container',
    actions: [
      'Rinse clean and remove non-glass caps.',
      'Handle carefully to avoid breakage.',
      'Deposit into dedicated glass recycling drop-off point.'
    ]
  },
  'E-Waste': {
    name: 'Electronic Waste (E-Waste)',
    type: 'Electronic Device',
    actions: [
      'Do not place electronic waste in normal household garbage.',
      'Wipe personal data if applicable.',
      'Deliver to authorized school or municipal e-waste collection center.'
    ]
  },
  Hazardous: {
    name: 'Hazardous / Chemical Waste',
    type: 'Hazardous Item',
    actions: [
      'Do not place in standard household bins.',
      'Keep in sealed container away from children.',
      'Follow local hazardous waste collection protocol.'
    ]
  }
};

export const classifyImageAsync = async (
  fileNameOrUrl: string,
  selectedDemo?: DemoClassification | null,
  fileName?: string
): Promise<Omit<WasteScan, 'id' | 'date'>> => {
  // If user selected a specific sample item chip
  if (selectedDemo) {
    return {
      itemName: selectedDemo.name,
      category: selectedDemo.category,
      confidence: selectedDemo.confidence,
      type: selectedDemo.type,
      recommendedActions: selectedDemo.recommendedActions,
      imageUrl: selectedDemo.sampleImage || fileNameOrUrl
    };
  }

  // Real neural network vision inference using TensorFlow MobileNet
  const neuralResult = await classifyImageWithNeuralNet(fileNameOrUrl, fileName);

  return {
    itemName: neuralResult.itemName,
    category: neuralResult.category,
    confidence: neuralResult.confidence,
    type: neuralResult.type,
    recommendedActions: neuralResult.recommendedActions,
    imageUrl: fileNameOrUrl
  };
};
