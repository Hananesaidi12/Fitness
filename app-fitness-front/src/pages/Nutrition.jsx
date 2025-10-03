import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Layout from "../components/Layout";

import { 
FaHistory, FaCheckCircle, FaSave
} from 'react-icons/fa';

const questions = [
  { id: 'gender', question: "Quel est ton sexe ?", type: "select", options: ['Homme', 'Femme'] },
  { id: 'age', question: "Quel est ton âge (en années) ?", type: "number" },
  { id: 'weight', question: "Quel est ton poids actuel (en kg) ?", type: "number" },
  { id: 'height', question: "Quelle est ta taille (en cm) ?", type: "number" },
  { id: 'activity', question: "Quel est ton niveau d'activité physique ?", type: "select", options: ['Sédentaire', 'Légèrement actif', 'Modérément actif', 'Très actif', 'Extrêmement actif'] },
  { id: 'diseases', question: "As-tu des maladies ou conditions médicales ?", type: "select", options: ['Aucune', 'Diabète', 'Hypertension', 'Cholestérol', 'Maladie cardiaque', 'Problèmes thyroïdiens', 'Autre'] },
  { id: 'goal', question: "Quel est ton objectif principal ?", type: "select", options: ['Perte de poids', 'Gain musculaire', 'Maintien', 'Amélioration de la santé'] },
  { id: 'allergies', question: "As-tu des allergies ou intolérances alimentaires ?", type: "text" },
  { id: 'diet', question: "As-tu un régime alimentaire spécifique ?", type: "select", options: ['Aucun', 'Végétarien', 'Végétalien', 'Sans gluten', 'Sans lactose', 'Pescétarien', 'Flexitarien'] },
];


const calculateDailyCalories = (answers) => {
  const { weight, height, age, gender, activity, goal } = answers;

  
  // Formule Mifflin-St Jeor pour le métabolisme de base
  let bmr;
  if (gender === 'Homme') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Multiplicateur d'activité
  const activityMultipliers = {
    'Sédentaire': 1.2,
    'Légèrement actif': 1.375,
    'Modérément actif': 1.55,
    'Très actif': 1.725,
    'Extrêmement actif': 1.9
  };
  
  let maintenanceCalories = bmr * activityMultipliers[activity];
  
  // Ajustement selon l'objectif
  if (goal === 'Perte de poids') {
    maintenanceCalories -= 500; // Déficit de 500 calories
  } else if (goal === 'Gain musculaire') {
    maintenanceCalories += 500; // Surplus de 500 calories
  }
  
  return Math.round(maintenanceCalories);
};

const calculateMacros = (calories, goal) => {
  let proteinPercentage, fatPercentage, carbPercentage;
  
  if (goal === 'Perte de poids') {
    proteinPercentage = 0.30;
    fatPercentage = 0.25;
    carbPercentage = 0.45;
  } else if (goal === 'Gain musculaire') {
    proteinPercentage = 0.35;
    fatPercentage = 0.25;
    carbPercentage = 0.40;
  } else {
    proteinPercentage = 0.25;
    fatPercentage = 0.25;
    carbPercentage = 0.50;
  }
  
  return {
    protein: Math.round((calories * proteinPercentage) / 4),
    fat: Math.round((calories * fatPercentage) / 9),
    carbs: Math.round((calories * carbPercentage) / 4)
  };
};

const getRecommendationList = (answers, dailyCalories, macros) => {
  const { weight, height, diseases, goal, allergies, diet, activity, age, gender } = answers;
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const recs = [];

  // Recommandations basées sur l'IMC
  if (bmi < 18.5) {
    recs.push("Tu es en insuffisance pondérale. Augmente ta consommation de calories avec des aliments riches en nutriments comme les avocats, les noix, les produits laitiers entiers et les protéines maigres.");
  } else if (bmi < 25) {
    recs.push("Ton poids est normal. Maintiens une alimentation équilibrée avec une variété d'aliments nutritifs.");
  } else if (bmi < 30) {
    recs.push("Tu es en surpoids. Privilégie une alimentation riche en fibres, protéines maigres et légumes, avec des portions contrôlées.");
  } else {
    recs.push("Tu es en situation d'obésité. Consulte un professionnel de santé pour un accompagnement personnalisé. En attendant, favorise les aliments à faible densité calorique et riches en nutriments.");
  }

  // Recommandations basées sur les conditions médicales
  if (diseases && diseases !== "Aucune") {
    if (diseases === "Diabète") {
      recs.push("Pour gérer ton diabète, privilégie les aliments à index glycémique bas comme les légumes non-féculeux, les céréales complètes et les protéines maigres. Évite les sucres raffinés et les glucides simples.");
    } else if (diseases === "Hypertension") {
      recs.push("Pour contrôler ton hypertension, réduis ta consommation de sodium, privilégie les aliments riches en potassium (bananes, épinards, patates douces) et limite les aliments transformés.");
    } else if (diseases === "Cholestérol") {
      recs.push("Pour améliorer ton profil lipidique, augmente ta consommation d'aliments riches en fibres solubles (avoine, légumineuses) et d'acides gras insaturés (avocat, noix, poissons gras). Limite les graisses saturées et trans.");
    } else if (diseases === "Maladie cardiaque") {
      recs.push("Pour soutenir ta santé cardiaque, adopte un régime méditerranéen riche en fruits, légumes, poissons gras et huile d'olive. Limite le sodium, les graisses saturées et les aliments transformés.");
    } else {
      recs.push(`Prends en compte ta condition médicale (${diseases}) en évitant certains aliments spécifiques et en suivant les recommandations de ton médecin.`);
    }
  }

  // Recommandations basées sur l'objectif
  if (goal === "Perte de poids") {
    recs.push("Pour perdre du poids, favorise les légumes non-féculeux, les protéines maigres (poulet, poisson, tofu), et les glucides complexes à index glycémique bas. Évite les sucres ajoutés, les aliments transformés et les gras saturés.");
    recs.push(`Maintiens un déficit calorique modéré d'environ 500 kcal par jour pour une perte de poids saine de 0.5 kg par semaine.`);
  } else if (goal === "Gain musculaire") {
    recs.push("Pour prendre du muscle, augmente ta consommation de protéines (1.6-2.2g/kg de poids corporel) et privilégie les glucides complexes pour l'énergie. Consomme des calories en léger surplus avec des aliments nutritifs.");
    recs.push("Répartis tes protéines tout au long de la journée, avec 20-40g par repas, et consomme une collation protéinée après l'entraînement.");
  } else if (goal === "Maintien") {
    recs.push("Pour maintenir ton poids, continue une alimentation équilibrée avec des portions adaptées à ton niveau d'activité. Varie tes sources de nutriments pour couvrir tous tes besoins.");
  } else if (goal === "Amélioration de la santé") {
    recs.push("Pour améliorer ta santé globale, privilégie les aliments riches en fibres, vitamines, minéraux et antioxydants. Incorpore une variété de fruits et légumes colorés, des céréales complètes, des protéines maigres et des graisses saines.");
  }

  // Recommandations basées sur les allergies
  if (allergies && allergies.trim() !== '') {
    recs.push(`Évite les aliments suivants à cause de tes allergies/intolérances : ${allergies}. Trouve des alternatives nutritives pour remplacer ces aliments.`);
  }

  // Recommandations basées sur le régime
  if (diet && diet !== "Aucun") {
    if (diet === "Végétarien") {
      recs.push("En tant que végétarien, assure-toi d'avoir un apport suffisant en protéines via les œufs, produits laitiers, légumineuses, tofu et tempeh. Surveille ton apport en fer et en vitamine B12.");
    } else if (diet === "Végétalien") {
      recs.push("En tant que végétalien, diversifie tes sources de protéines végétales (légumineuses, céréales complètes, noix et graines). Considère une supplémentation en vitamine B12, et surveille ton apport en fer, calcium et oméga-3.");
    } else if (diet === "Sans gluten") {
      recs.push("Avec un régime sans gluten, privilégie les céréales naturellement sans gluten comme le riz, le quinoa, le sarrasin et le millet. Attention aux produits transformés étiquetés sans gluten qui peuvent être pauvres en nutriments.");
    } else if (diet === "Sans lactose") {
      recs.push("Avec un régime sans lactose, assure-toi d'obtenir suffisamment de calcium via les légumes verts feuillus, les amandes, les produits enrichis et les poissons avec arêtes. Les produits laitiers fermentés comme le yogourt grec peuvent parfois être tolérés.");
    }
  }

  // Recommandations générales
  recs.push(`Tes besoins caloriques estimés sont de ${dailyCalories} kcal par jour. Répartis-les ainsi : ${macros.protein}g de protéines, ${macros.carbs}g de glucides et ${macros.fat}g de lipides.`);
  recs.push("Hydrate-toi suffisamment : bois au moins 1.5 à 2 litres d'eau par jour, davantage si tu es actif ou par temps chaud.");
  recs.push("Privilégie les aliments peu transformés et cuisines toi-même autant que possible pour contrôler la qualité et la quantité de tes repas.");
  recs.push("Consulte un nutritionniste ou un diététicien pour un suivi personnalisé, surtout si tu as des conditions médicales spécifiques.");

  return recs;
};

const getMealPlan = (goal, diet, allergies) => {
  // Plans de base pour chaque objectif
  const basePlans = {
    "Perte de poids": {
      Lundi: [
        "Petit-déjeuner : Œufs brouillés (2 œufs) avec épinards et tomates, tranche de pain complet",
        "Collation : Yaourt grec nature avec une poignée de baies",
        "Déjeuner : Salade de quinoa avec poulet grillé, concombre, poivrons et vinaigrette légère",
        "Collation : Carottes et houmous",
        "Dîner : Filet de poisson blanc au four avec asperges et patate douce rôtie"
      ],
      Mardi: [
        "Petit-déjeuner : Smoothie protéiné (protéine en poudre, épinards, banane, lait d'amande)",
        "Collation : Pomme avec une cuillère à soupe de beurre d'arachide",
        "Déjeuner : Wrap de laitue avec dinde, avocat et légumes croquants",
        "Collation : Fromage blanc 0% avec des noix",
        "Dîner : Chili con carne light avec haricots rouges, bœuf haché maigre et légumes"
      ],
      Mercredi: [
        "Petit-déjeuner : Porridge d'avoine avec cannelle et fruits rouges",
        "Collation : Œuf dur et bâtonnets de concombre",
        "Déjeuner : Courgettes farcies au thon et fromage blanc, salade verte",
        "Collation : Tranches de poire avec quelques noix",
        "Dîner : Poulet rôti aux herbes avec brocolis vapeur et quinoa"
      ],
      Jeudi: [
        "Petit-déjeuner : Omelette aux champignons et oignons, tranche de pain de seigle",
        "Collation : Fromage frais avec des graines de lin",
        "Déjeuner : Salade de lentilles avec saumon fumé et vinaigrette au citron",
        "Collation : Céleri avec beurre d'amande",
        "Dîner : Saumon en croûte d'herbes avec haricots verts et riz sauvage"
      ],
      Vendredi: [
        "Petit-déjeuner : Yaourt nature avec granola maison et fruits frais",
        "Collation : Smoothie vert (épinards, concombre, pomme verte, citron)",
        "Déjeuner : Bowl poke avec riz brun, thon, avocat et légumes croquants",
        "Collation : Quelques amandes et un carré de chocolat noir",
        "Dîner : Brochettes de poulet aux poivrons et oignons, salade de quinoa"
      ],
      Samedi: [
        "Petit-déjeuner : Pancakes protéinés à la banane et aux flocons d'avoine",
        "Collation : Houmous et bâtonnets de légumes",
        "Déjeuner : Omelette aux légumes et feta, salade verte",
        "Collation : Poignée de baies et noix",
        "Dîner : Filet de bœuf grillé avec ratatouille et patate douce"
      ],
      Dimanche: [
        "Petit-déjeuner : Toast d'avocat avec œuf poché et graines de sésame",
        "Collation : Fromage blanc avec miel et noix",
        "Déjeuner : Poulet curry léger au lait de coco avec légumes et riz basmati",
        "Collation : Pomme cuite à la cannelle",
        "Dîner : Soupe de légumes maison avec des lentilles et un œuf mollet"
      ]
    },
    "Gain musculaire": {
      Lundi: [
        "Petit-déjeuner : Porridge protéiné (avoine, whey, banane, beurre de cacahuète)",
        "Collation : Shake protéiné et fruit",
        "Déjeuner : Poulet grillé, riz brun, brocolis et avocat",
        "Collation : Yaourt grec avec miel et amandes",
        "Dîner : Saumon, patate douce et asperges avec huile d'olive"
      ],
      Mardi: [
        "Petit-déjeuner : Omelette de 3 œufs avec fromage, épinards et toast complet",
        "Collation : Fromage blanc et fruits à coque",
        "Déjeuner : Bœuf haché maigre, pâtes complètes et sauce tomate maison",
        "Collation : Barre protéinée maison et banane",
        "Dîner : Blanc de dinde, quinoa et haricots verts"
      ],
      Mercredi: [
        "Petit-déjeuner : Smoothie bowl (banane, berries, whey, lait d'amande, granola)",
        "Collation : Œufs durs et pain complet",
        "Déjeuner : Thon, riz basmati et salade de légumes variés",
        "Collation : Cottage cheese et fruits rouges",
        "Dîner : Steak de bœuf, patate douce et épinards sautés"
      ],
      Jeudi: [
        "Petit-déjeuner : Pancakes à l'avoine et protéine en poudre, sirop d'érable",
        "Collation : Mélange trail maison (noix, graines, fruits secs)",
        "Déjeuner : Poulet curry, riz et légumes variés",
        "Collation : Yaourt grec et beurre de cacahuète",
        "Dîner : Filet de porc, purée de patate douce et haricots"
      ],
      Vendredi: [
        "Petit-déjeuner : Bowl de quinoa (quinoa cuit, lait, fruits, noix)",
        "Collation : Shake gainer maison",
        "Déjeuner : Saumon, pâtes complètes et brocolis",
        "Collation : Fromage et crackers complets",
        "Dîner : Escalope de dinde, riz sauvage et champignons"
      ],
      Samedi: [
        "Petit-déjeuner : Œufs bénédictine sur toast complet avec avocat",
        "Collation : Barre protéinée et fruit",
        "Déjeuner : Chili con carne avec riz brun et avocat",
        "Collation : Smoothie protéiné à la banane",
        "Dîner : Agneau grillé, couscous complet et légumes rôtis"
      ],
      Dimanche: [
        "Petit-déjeuner : French toast protéiné avec fruits et sirop d'érable",
        "Collation : Muffin protéiné maison",
        "Déjeuner : Rôti de bœuf, pommes de terre rôties et carottes",
        "Collation : Fromage blanc et noix de cajou",
        "Dîner : Poulet rôti, quinoa et légumes grillés"
      ]
    },
    "Maintien": {
      Lundi: [
        "Petit-déjeuner : Muesli maison avec yaourt et fruits frais",
        "Collation : Poignée d'amandes et fruit",
        "Déjeuner : Salade composée (quinoa, poulet, légumes, vinaigrette maison)",
        "Collation : Houmous et crudités",
        "Dîner : Poisson blanc, riz basmati et légumes vapeur"
      ],
      Mardi: [
        "Petit-déjeuner : Pain complet avec fromage frais et tomates",
        "Collation : Yaourt et miel",
        "Déjeuner : Wrap au poulet et légumes avec sauce yaourt",
        "Collation : Compote sans sucode ajouté",
        "Dîner : Omelette aux champignons, salade verte"
      ],
      Mercredi: [
        "Petit-déjeuner : Smoothie (banane, épinards, lait végétal, graines de chia)",
        "Collation : Quelques noix et un fruit",
        "Déjeuner : Lentilles avec saucisse de tofu, légumes",
        "Collation : Fromage blanc et baies",
        "Dîner : Poulet au citron, boulgour et courgettes grillées"
      ],
      Jeudi: [
        "Petit-déjeuner : Œufs à la coque, soldiers de pain complet",
        "Collation : Pomme et beurre de cacahuète",
        "Déjeuner : Salade de pâtes complètes au thon et légumes",
        "Collation : Carrés de fromage et crackers",
        "Dîner : Filet de porc, purée de carottes et pois"
      ],
      Vendredi: [
        "Petit-déjeuner : Porridge à l'avoine avec fruits et cannelle",
        "Collation : Yaourt à boire et fruit",
        "Déjeuner : Quiche légère aux légumes, salade verte",
        "Collation : Mélange de fruits secs",
        "Dîner : Pizza maison sur base complète, salade"
      ],
      Samedi: [
        "Petit-déjeuner : Pancakes à la banane et sirop d'érable",
        "Collation : Smoothie vert",
        "Déjeuner : Burger maison avec pain complet, frites de patate douce au four",
        "Collation : Fromage frais et crackers",
        "Dîner : Poêlée de fruits de mer, riz sauvage"
      ],
      Dimanche: [
        "Petit-déjeuner : Omelette espagnole (pommes de terre, oignons, poivrons)",
        "Collation : Muffin maison aux fruits",
        "Déjeuner : Rôti de poulet, légumes rôtis, pommes de terre",
        "Collation : Salade de fruits frais",
        "Dîner : Soupe de légumes, omelette aux herbes"
      ]
    },
    "Amélioration de la santé": {
      Lundi: [
        "Petit-déjeuner : Bowl de chia pudding aux fruits rouges et noix",
        "Collation : Bâtonnets de carotte et houmous",
        "Déjeuner : Salade de quinoa aux légumes grillés et vinaigrette au citron",
        "Collation : Poignée de noix et un fruit",
        "Dîner : Filet de saumon, brocolis vapeur и patate douce"
      ],
      Mardi: [
        "Petit-déjeuner : Smoothie vert (épinards, banane, avocat, lait d'amande)",
        "Collation : Yaourt au lait de coco et graines de chia",
        "Déjeuner : Soupe de lentilles corail, pain complet",
        "Collation : Céleri avec beurre d'amande",
        "Dîner : Poulet aux herbes, ratatouille et quinoa"
      ],
      Mercredi: [
        "Petit-déjeuner : Avoine overnight avec fruits et graines de lin",
        "Collation : Houmous et légumes croquants",
        "Déjeuner : Bowl Buddha (riz brun, légumes, avocat, sauce tahini)",
        "Collation : Compote de pomme sans sucre",
        "Dîner : Poisson blanc en papillote, légumes méditerranéens"
      ],
      Jeudi: [
        "Petit-déjeuner : Toast à l'avocat et œuf poché, graines de sésame",
        "Collation : Poignée de noix et un fruit",
        "Déjeuner : Salade de chou kale avec patate douce rôtie et pois chiches",
        "Collation : Smoothie vert",
        "Dîner : Dahl de lentilles, riz basmati"
      ],
      Vendredi: [
        "Petit-déjeuner : Porridge au curcuma et lait de coco",
        "Collation : Carrés de feta et pastèque",
        "Déjeuner : Taboulé de chou-fleur, poulet grillé",
        "Collation : Yaourt grec et miel",
        "Dîner : Escalope de tofu, nouilles de courgette, sauce aux cacahuètes"
      ],
      Samedi: [
        "Petit-déjeuner : Crêpes de sarrasin, compote sans sucre",
        "Collation : Poignée de baies de goji et amandes",
        "Déjeuner : Salade de pousses d'épinards, betterave, noix et fromage de chèvre",
        "Collation : Jus vert maison (concombre, épinards, pomme, citron)",
        "Dîner : Curry de légumes, riz complet"
      ],
      Dimanche: [
        "Petit-déjeuner : Omelette aux champignons sauvages et fines herbes",
        "Collation : Poire et noix du Brésil",
        "Déjeuner : Soupe miso, sushi bowl (riz, avocat, concombre, saumon cru)",
        "Collation : Chocolat noir et amandes",
        "Dîner : Poulet rôti au thym, légumes de saison rôtis"
      ]
    }
  };

  let mealPlan = basePlans[goal];

  // Adapter le plan en fonction du régime
  if (diet && diet !== "Aucun") {
    const adaptForDiet = (meals, dietType) => {
      return meals.map(meal => {
        if (dietType === "Végétarien") {
          return meal
            .replace(/poulet|dinde|bœuf|steak|viande|porc|agneau|saumon|poisson|thon/i, "substitut végétal")
            .replace(/œufs?/gi, "œufs ou tofu")
            .replace(/fromage/gi, "fromage végétal");
        } else if (dietType === "Végétalien") {
          return meal
            .replace(/poulet|dinde|bœuf|steak|viande|porc|agneau|saumon|poisson|thon|œufs?|fromage|yaourt|lait|beurre/gi, "substitut végétal")
            .replace(/lait/gi, "lait végétal")
            .replace(/beurre/gi, "beurre végétal")
            .replace(/yaourt/gi, "yaourt végétal")
            .replace(/fromage/gi, "fromage végétal");
        } else if (dietType === "Sans gluten") {
          return meal
            .replace(/pain|pâtes|wrap|quinoa|boulgour|avoine|blé/gi, "substitut sans gluten")
            .replace(/pain/gi, "pain sans gluten")
            .replace(/pâtes/gi, "pâtes sans gluten");
        } else if (dietType === "Sans lactose") {
          return meal
            .replace(/lait|yaourt|fromage|beurre/gi, "substitut sans lactose")
            .replace(/lait/gi, "lait sans lactose")
            .replace(/yaourt/gi, "yaourt sans lactose")
            .replace(/fromage/gi, "fromage sans lactose");
        }
        return meal;
      });
    };

    for (const day in mealPlan) {
      mealPlan[day] = adaptForDiet(mealPlan[day], diet);
    }
  }

  // Adapter le plan en fonction des allergies
  if (allergies && allergies.trim() !== '') {
    const allergyList = allergies.toLowerCase().split(',');
    
    const adaptForAllergies = (meals, allergies) => {
      return meals.map(meal => {
        let adaptedMeal = meal;
        allergies.forEach(allergy => {
          const trimmedAllergy = allergy.trim();
          if (trimmedAllergy) {
            adaptedMeal = adaptedMeal.replace(new RegExp(trimmedAllergy, 'gi'), "substitut approprié");
          }
        });
        return adaptedMeal;
      });
    };

    for (const day in mealPlan) {
      mealPlan[day] = adaptForAllergies(mealPlan[day], allergyList);
    }
  }

  return mealPlan;
};const getWorkoutRoutine = (goal) => {
  const routines = {
    "Perte de poids": ["cardio", "squats", "Pompes", "yoga"],
    "Gain musculaire": ["strength", "squats", "Pompes", "stretching"],
    "Maintien": ["cardio", "yoga", "Pompes", "squats", "stretching"],
    "Amélioration de la santé": ["yoga", "meditation", "stretching", "cardio"],
  };

  return routines[goal]?.map((id) => (
    <Link
      key={id}
      to={
        id === "squats"
          ? "/workouts/squats/squat-basic"
          : id === "yoga"
          ? "/workouts/yoga/kapalabhati"
          : id === "stretching"
          ? "/workouts/stretching/arm-cross-stretch"
          : id === "meditation"
          ? "/workouts/meditation/visualisation"
          : id === "cardio"
          ? "/workouts/cardio/Assault-air-bike"
          : id === "Pompes"
          ? "/workouts/Pompes/pompe-archer"
          : id === "strength"
          ? "/workouts/strength/dumbbell-bent-over-row-Cookie"
          : `/workouts/${id}`
      }
      style={styles.catalogueBtn}
    >
      Voir les exercices ({id})
    </Link>
  ));
};





const Nutrition = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  const [user, setUser] = useState({ first_name: '', last_name: '' });
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [savedPlans, setSavedPlans] = useState([]);
  const [mealPlan, setMealPlan] = useState(null); // Plan en cours
  const [showHistory, setShowHistory] = useState(false);
   // Définition des états pour macros et calories
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:8000/user/${userId}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error('Erreur fetch user:', err));
      
      // Charger les plans sauvegardés
      const saved = localStorage.getItem(`nutrition_plans_${userId}`);
      if (saved) {
        setSavedPlans(JSON.parse(saved));
      }
      
    }
  }, []);

  const getInitials = () => `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

  const handleChange = (e) => {
    setAnswers({ ...answers, [questions[currentStep].id]: e.target.value });
  };

  const handleNext = () => {
    const currentAnswer = answers[questions[currentStep].id];
    if (currentAnswer === undefined || currentAnswer === '') {
      alert("Merci de répondre avant de continuer.");
      return;
    }
    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculer les calories et macros avant d'afficher les résultats
      const calories = calculateDailyCalories(answers);
      const macroCalculations = calculateMacros(calories, answers.goal);
      setDailyCalories(calories);
      setMacros(macroCalculations);
      setShowResult(true);
    }
  };

// 🔹 Sauvegarde des résultats dans localStorage
localStorage.setItem("nutritionResults", JSON.stringify({
  dailyCalories,
  macros
}));
 const handleSubmit = (e) => {
  e.preventDefault();

  // 1. Calculer les résultats
  const dailyCalories = calculateDailyCalories(answers);
  const macros = calculateMacros(dailyCalories, answers.goal);

  // 2. Sauvegarder dans localStorage
  localStorage.setItem("nutritionResults", JSON.stringify({
    dailyCalories,
    macros
  }));

  // 3. (Optionnel) rediriger vers le Dashboard
  navigate("/dashbordLite");
};


  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    if (window.confirm("Recommencer le questionnaire ?")) {
      setAnswers({});
      setCurrentStep(0);
      setShowResult(false);
    }
  };
   const handleSaveResults = () => {
    const calories = calculateDailyCalories(answers);
    const macroSplit = calculateMacros(calories, answers.goal);

    setDailyCalories(calories);
    setMacros(macroSplit);

    // 🔥 Sauvegarde dans localStorage
    localStorage.setItem("nutritionResults", JSON.stringify({
      dailyCalories: calories,
      macros: macroSplit
    }));

    alert("Résultats nutritionnels enregistrés !");
  };


  const saveCurrentPlan = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    
    const plan = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR'),
      answers: {...answers},
      calories: dailyCalories,
      macros: {...macros},
      recommendations: getRecommendationList(answers, dailyCalories, macros),
      mealPlan: getMealPlan(answers.goal, answers.diet, answers.allergies),
      workoutRoutine: getWorkoutRoutine(answers.goal)
    };
    
    const updatedPlans = [plan, ...savedPlans.slice(0, 4)]; // Garder seulement les 5 derniers plans
    setSavedPlans(updatedPlans);
    localStorage.setItem(`nutrition_plans_${userId}`, JSON.stringify(updatedPlans));
    
    alert('Plan sauvegardé avec succès !');
  };

  const loadSavedPlan = (plan) => {
    setAnswers(plan.answers);
    setDailyCalories(plan.calories);
    setMacros(plan.macros);
    setShowResult(true);
    setShowHistory(false);
  };

  const deleteSavedPlan = (planId) => {
    const updatedPlans = savedPlans.filter(plan => plan.id !== planId);
    setSavedPlans(updatedPlans);
    
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(`nutrition_plans_${userId}`, JSON.stringify(updatedPlans));
    }
  };

  const recommendations = getRecommendationList(answers, dailyCalories, macros);
  
  return (
   <Layout title="Personalized Fitness Plans">
      <main style={styles.mainContent}>
        

        <section style={styles.card}>
      
           
       
       

{showHistory ? (
  <div style={styles.card}>
    <h2 style={styles.resultTitle}>
   Vos <span style={{ color: "#2C3E50" }}>plans</span> sauvegardés
</h2>


    {savedPlans.length > 0 ? (
      <table style={{ ...styles.table, border: "1px solid #bdc3c7", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#ecf0f1" }}>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Objectif</th>
            <th style={styles.th}>Calories / jour</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {savedPlans.map(plan => (
            <tr key={plan.id}>
              <td style={styles.td}>{plan.date}</td>
              <td style={styles.td}>
                <span style={styles.badge}>{plan.answers.goal}</span>
              </td>
              <td style={styles.td}>{plan.calories} kcal</td>
              <td style={styles.actionCell}>
                {/* Charger badge (optionnel icône simple) */}
                <span 
                  onClick={() => loadSavedPlan(plan)} 
                  style={{
                    ...styles.badgeAction,
                    background: "#3498db"  // bleu
                  }}
                >
                  🔄
                </span>

                {/* Supprimer badge */}
                <span 
                  onClick={() => deleteSavedPlan(plan.id)} 
                  style={{
                    ...styles.badgeAction,
                    background: "#e74c3c"  // rouge
                  }}
                >
                  🗑
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p style={{ textAlign: "center", marginTop: "20px", color: "#7f8c8d", fontStyle: "italic" }}>
        Aucun plan sauvegardé pour le moment...
      </p>
    )}

    {/* Bouton retour */}
    <button
      onClick={() => {
        setAnswers({ goal: "", age: "", weight: "", height: "", activity: "" });
        setShowHistory(false);
      }}
      style={styles.backBtn}
    >
      ⬅ Retour au questionnaire
    </button>
  </div>
) 


 : (


          <div style={styles.card}>
            {!showResult ? (
              <>
                <div style={styles.progressBar}>
                  <div style={{ width: `${((currentStep + 1) / questions.length) * 100}%`, height: '100%', backgroundColor: '#FF6F3C', borderRadius: 5 }}></div>
                </div>
                <p style={styles.stepIndicator}>Question {currentStep + 1}/{questions.length}</p>
                
                <h3 style={styles.question}>{questions[currentStep].question}</h3>
                
                {questions[currentStep].type === 'number' && (
                  <input
                    type="number"
                    value={answers[questions[currentStep].id] || ''}
                    onChange={handleChange}
                    style={styles.input}
                    min="0"
                  />
                )}
                {questions[currentStep].type === 'text' && (
                  <input
                    type="text"
                    value={answers[questions[currentStep].id] || ''}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Liste tes allergies séparées par des virgules"
                  />
                )}
                {questions[currentStep].type === 'select' && (
                  <select
                    value={answers[questions[currentStep].id] || ''}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="">-- Choisis une option --</option>
                    {questions[currentStep].options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                
                <div style={styles.buttonGroup}>
                  {currentStep > 0 && (
                    <button onClick={handlePrevious} style={styles.prevBtn}>
                      Précédent
                    </button>
                  )}
                  <button onClick={handleNext} style={styles.nextBtn}>
                    {currentStep + 1 === questions.length ? 'Voir les recommandations' : 'Suivant'}
                  </button>
                  <button 
                onClick={() => setShowHistory(!showHistory)} 
                style={styles.nextBtn}
              >
                <FaHistory style={{ marginRight: 8 }} />
                Historique
              </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={styles.resultTitle}>Vos recommandations personnalisées <button 
                onClick={() => setShowHistory(!showHistory)} 
                style={styles.nextBtn}
              >
                <FaHistory style={{ marginRight: 8 }} />
                Historique
              </button></h2>
                
                <div style={styles.summaryBox}>
                  <h4 style={styles.summaryTitle}>Résumé de votre profil</h4>
                  <p><strong>Objectif:</strong> {answers.goal}</p>
                  <p><strong>Calories quotidiennes:</strong> {dailyCalories} kcal</p>
                  <p><strong>Macronutriments:</strong> {macros.protein}g protéines, {macros.carbs}g glucides, {macros.fat}g lipides</p>
                  {answers.diseases && answers.diseases !== "Aucune" && (
                    <p><strong>Condition médicale:</strong> {answers.diseases}</p>
                  )}
                  {answers.allergies && (
                    <p><strong>Allergies:</strong> {answers.allergies}</p>
                  )}
                  {answers.diet && answers.diet !== "Aucun" && (
                    <p><strong>Régime:</strong> {answers.diet}</p>
                  )}
                </div>

                <h3 style={styles.sectionTitle}>📋 Recommandations nutritionnelles</h3>
                <div style={styles.recoBox}>
                  <ul style={styles.recoList}>
                    {recommendations.map((rec, i) => (
                      <li key={i} style={styles.recoItem}>
                        <FaCheckCircle style={styles.checkIcon} /> {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {(parseFloat(answers.weight) > 100 && answers.diseases && answers.diseases !== 'Aucune') && (
                  <Link to="/community" style={styles.alertBtn}>
                    ⚠️ Contacter un coach ou un médecin
                  </Link>
                )}

                <h3 style={styles.sectionTitle}>🍽️ Plan nutritionnel hebdomadaire</h3>
                <div style={styles.planContainer}>
                  {Object.entries(getMealPlan(answers.goal, answers.diet, answers.allergies)).map(([day, meals]) => (
                    <div key={day} style={styles.dayPlan}>
                      <h4 style={styles.dayTitle}>{day}</h4>
                      <ul style={styles.mealList}>
                        {meals.map((m, i) => (
                          <li key={i} style={styles.mealItem}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <h3 style={styles.sectionTitle}>🏋️ Programme d'entraînement recommandé</h3>

<div style={styles.workoutBox}>
  <div style={styles.workoutGrid}>
    {getWorkoutRoutine(answers.goal).map((link, idx) => (
      <div key={idx} style={styles.workoutCard}>
        {link}
      </div>
    ))}
  </div>
</div>




                <div style={styles.actionButtons}>
                  <button onClick={handleRestart} style={styles.restartBtn}>
                    Nouveau questionnaire
                  </button>
                  <button onClick={saveCurrentPlan} style={styles.restartBtn}>
                    <FaSave style={{ marginRight: 8 }} />
                    Sauvegarder ce plan
                  </button>
                  
                </div>
              </>
              
            )}
          </div>
          
        )}
         </section>
      </main>
    </Layout>
  );
};
const styles = {
  card: { background: '#fff', borderRadius: 15, padding: 30, maxWidth: 1000, margin: '0 auto', width: '100%' },
  progressBar: { height: 10, backgroundColor: '#e9ecef', borderRadius: 5, marginBottom: 15 },
  stepIndicator: { fontSize: 14, color: '#6c757d', marginBottom: 20 },
  question: { fontSize: 20, marginBottom: 25, color: '#2D3748' },
  input: { width: '100%', padding: '12px 15px', marginTop: 10, fontSize: 16, borderRadius: 8, border: '1px solid #ddd', marginBottom: 20 },
  buttonGroup: { display: 'flex', justifyContent: 'space-between', marginTop: 25 },
  prevBtn: { backgroundColor: '#6c757d', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: '600', cursor: 'pointer', border: 'none', fontSize: 16 },
  nextBtn: { backgroundColor: '#FF6F3C', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: '600', cursor: 'pointer', border: 'none', fontSize: 16 },
  resultTitle: { 
  textAlign: 'center', 
  color:'#2C3E50', 
  marginBottom: 30, 
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  
},

  summaryBox: { backgroundColor: '#e8f4f8', borderLeft: '4px solid #17a2b8', padding: '15px 20px', borderRadius: 8, marginBottom: 30 },
  summaryTitle: { color: '#17a2b8', marginTop: 0 },
  sectionTitle: { marginTop: 30, fontSize: 20, color: '#FF6F3C', borderBottom: '2px solid #FF6F3C', paddingBottom: 5, marginBottom: 15 },
  recoBox: { backgroundColor: '#fffdf8', border: '1px solid #FFD8B1', borderRadius: 10, padding: 20, boxShadow: '0 4px 10px rgba(255,111,60,0.1)', marginBottom: 20 },
  recoList: { listStyle: 'none', paddingLeft: 0, margin: 0 },
  recoItem: { display: 'flex', alignItems: 'flex-start', marginBottom: 12, fontSize: 16, color: '#5A4D41' },
  checkIcon: { color: '#FF6F3C', marginRight: 8, flexShrink: 0, marginTop: 3 },
  alertBtn: { display: 'inline-block', backgroundColor: '#dc3545', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: '700', textDecoration: 'none', marginTop: 20, marginBottom: 20, fontSize: 16, boxShadow: '0 4px 10px rgba(220,53,69,0.3)' },
  planContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 30 },
  dayPlan: { backgroundColor: '#f0f4f8', border: '1px solid #d6e0eb', borderRadius: 10, padding: 15 },
  dayTitle: { color: '#2D3748', marginTop: 0, paddingBottom: 10, borderBottom: '1px solid #cbd5e0' },
  mealList: { paddingLeft: 20, marginBottom: 0 },
  mealItem: { marginBottom: 8, fontSize: 14 },
  workoutBox: { backgroundColor: '#f0f4f8', border: '1px solid #d6e0eb', borderRadius: 10, padding: 20, marginBottom: 30 },
  workoutList: { columns: 2, paddingLeft: 20 },
  workoutItem: { marginBottom: 10, breakInside: 'avoid' },
 workoutBox: {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "25px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  marginBottom: "30px",
},

workoutGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
},

workoutCard: {
  background: "linear-gradient(135deg,#fff6f2,#ffe9e0)",
  border: "1px solid #ffd5c2",
  borderRadius: "12px",
  padding: "18px",
  textAlign: "center",
  fontWeight: "600",
  fontSize: "16px",
  color: "#FF6F3C",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(255,111,60,0.15)",
},
"workoutCard:hover": {
  transform: "translateY(-5px) scale(1.02)",
  boxShadow: "0 8px 18px rgba(255,111,60,0.25)",
},

  actionButtons: { display: 'flex', justifyContent: 'center', gap: 15, marginTop: 30 },
  restartBtn: { backgroundColor: '#6c757d', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: '600', cursor: 'pointer', border: 'none', fontSize: 16 },
  printBtn: { backgroundColor: '#28a745', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: '600', cursor: 'pointer', border: 'none', fontSize: 16 },
  historyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    marginTop: "25px",
  },
  planCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  planHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  planDate: {
    fontWeight: "bold",
    color: "#34495e",
  },
  badge: {
    padding: "5px 12px",
    background: "#3498db",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "600",
  },
  planContent: {
    marginBottom: "15px",
    color: "#2c3e50",
  },
  planActions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },
  actionBtn: {
    flex: 1,
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "opacity 0.3s ease, transform 0.2s ease",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "linear-gradient(135deg,#6c757d,#495057)",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  backBtnHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
  },
  nextBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "linear-gradient(135deg,#FF6F3C,#FF922B)",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(255,111,60,0.3)",
  },
  nextBtnHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 14px rgba(255,111,60,0.4)",
  },
  table: {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
},
"table th": {
  background: "#FF6F3C",
  color: "#fff",
  textAlign: "left",
  padding: "14px",
  fontSize: "15px",
},
"table td": {
  padding: "12px 14px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
  color: "#2c3e50",
},
"table tr:hover": {
  background: "#fff6f2",
  transition: "background 0.3s ease",
},
actionCell: {
  display: "flex",
  gap: "10px",
},
th: {
  padding: "10px",
  border: "1px solid #bdc3c7",
  textAlign: "left"
},
td: {
  padding: "10px",
  border: "1px solid #bdc3c7"
},
badgeAction: {
  display: "inline-block",
  padding: "6px 12px",
  margin: "0 5px",
  borderRadius: "20px",
  color: "#fff",
  fontSize: "13px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  transition: "transform 0.2s ease"
}
,
catalogueBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #FF6F3C, #FF9A3C)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    padding: "12px 20px",
    borderRadius: "12px",
    textDecoration: "none",
    boxShadow: "0 4px 14px rgba(255,111,60,0.25)",
    transition: "all 0.3s ease",
  },

  btnIcon: {
    fontSize: "18px",
  },

  "catalogueBtn:hover": {
    transform: "translateY(-3px) scale(1.02)",
    boxShadow: "0 8px 20px rgba(255,111,60,0.35)",
  },

  "catalogueBtn:active": {
    transform: "scale(0.96)",
  },

};



export default Nutrition;