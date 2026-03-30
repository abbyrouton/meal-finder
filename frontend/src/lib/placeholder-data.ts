import { Recipe } from '@/types';

export interface RecipeDetail extends Recipe {
  ingredients: string;
  steps: string;
  notes: string;
  user_id: string;
  created_at: string;
}

export const placeholderRecipes: RecipeDetail[] = [
  {
    id: 'placeholder-1',
    title: 'Classic Margherita Pizza',
    description: 'A traditional Italian pizza with fresh mozzarella, tomatoes, and basil on a crispy thin crust.',
    cuisine_type: 'Italian',
    prep_time: 45,
    user_name: 'Chef Marco',
    user_id: 'user-1',
    avg_rating: 4.8,
    created_at: '2024-01-15',
    ingredients: `2 1/4 cups all-purpose flour
1 tsp instant yeast
1 tsp salt
1 tbsp olive oil
3/4 cup warm water
1 can San Marzano tomatoes (14 oz)
8 oz fresh mozzarella
Fresh basil leaves
2 cloves garlic, minced
Salt and pepper to taste`,
    steps: `1. Make the dough: Combine flour, yeast, and salt. Add water and olive oil. Knead for 8-10 minutes until smooth. Let rise for 1 hour.

2. Prepare the sauce: Crush tomatoes by hand, add minced garlic, salt, and a drizzle of olive oil. Let sit for 30 minutes.

3. Preheat your oven to the highest setting (500°F/260°C) with a pizza stone or inverted baking sheet inside.

4. Stretch the dough into a 12-inch circle on a floured surface. Don't use a rolling pin - use your hands to preserve the air bubbles.

5. Spread a thin layer of sauce, leaving a 1-inch border. Tear mozzarella into pieces and distribute evenly.

6. Slide pizza onto the hot stone and bake for 8-10 minutes until the crust is golden and cheese is bubbling.

7. Remove from oven, add fresh basil leaves, drizzle with olive oil, and serve immediately.`,
    notes: `For best results, let the dough cold-ferment in the refrigerator overnight. The longer fermentation develops more flavor. If you have a pizza oven that can reach higher temperatures, even better!`,
  },
  {
    id: 'placeholder-2',
    title: 'Spicy Thai Basil Chicken',
    description: 'Aromatic stir-fried chicken with Thai basil, chilies, and garlic. Quick and packed with flavor.',
    cuisine_type: 'Thai',
    prep_time: 25,
    user_name: 'Lisa Chen',
    user_id: 'user-2',
    avg_rating: 4.6,
    created_at: '2024-01-20',
    ingredients: `1 lb ground chicken
4 cloves garlic, minced
4-6 Thai chilies, sliced
2 shallots, sliced
2 cups Thai basil leaves
2 tbsp vegetable oil
2 tbsp fish sauce
1 tbsp oyster sauce
1 tbsp soy sauce
1 tsp sugar
Jasmine rice for serving
Fried egg (optional)`,
    steps: `1. Heat oil in a wok over high heat until smoking.

2. Add garlic and chilies, stir-fry for 30 seconds until fragrant.

3. Add ground chicken, breaking it apart with your spatula. Cook for 3-4 minutes until no longer pink.

4. Add shallots and stir-fry for 1 minute.

5. Add fish sauce, oyster sauce, soy sauce, and sugar. Stir to combine.

6. Remove from heat and fold in Thai basil leaves. They will wilt from residual heat.

7. Serve immediately over steamed jasmine rice. Top with a fried egg if desired.`,
    notes: `The key to this dish is high heat and quick cooking. Have all your ingredients prepped before you start. Use holy basil if you can find it for more authentic flavor.`,
  },
  {
    id: 'placeholder-3',
    title: 'Beef Tacos al Pastor',
    description: 'Marinated beef tacos with pineapple, cilantro, and onions. Street food style.',
    cuisine_type: 'Mexican',
    prep_time: 35,
    user_name: 'Carlos Rivera',
    user_id: 'user-3',
    avg_rating: 4.9,
    created_at: '2024-02-01',
    ingredients: `1.5 lbs beef sirloin, thinly sliced
3 dried guajillo chilies
2 dried ancho chilies
1/2 cup pineapple juice
3 cloves garlic
1 tsp cumin
1 tsp oregano
1/4 cup white vinegar
Salt to taste
1 cup fresh pineapple, diced
1 white onion, diced
Fresh cilantro
Corn tortillas
Lime wedges`,
    steps: `1. Toast dried chilies in a dry pan for 1-2 minutes. Remove stems and seeds, then soak in hot water for 15 minutes.

2. Blend soaked chilies with pineapple juice, garlic, cumin, oregano, vinegar, and salt until smooth.

3. Marinate sliced beef in the sauce for at least 2 hours, preferably overnight.

4. Heat a cast iron skillet over high heat. Cook marinated beef in batches for 2-3 minutes per side.

5. Warm corn tortillas on a dry skillet.

6. Serve beef on tortillas topped with diced pineapple, onion, cilantro, and a squeeze of lime.`,
    notes: `For extra authenticity, char the pineapple chunks on the same pan as the meat. The caramelized pineapple adds amazing sweetness.`,
  },
  {
    id: 'placeholder-4',
    title: 'Creamy Mushroom Risotto',
    description: 'Rich and creamy arborio rice with mixed mushrooms, parmesan, and white wine.',
    cuisine_type: 'Italian',
    prep_time: 40,
    user_name: 'Chef Marco',
    user_id: 'user-1',
    avg_rating: 4.5,
    created_at: '2024-02-10',
    ingredients: `1.5 cups arborio rice
4 cups chicken or vegetable stock
1 cup mixed mushrooms (cremini, shiitake, oyster)
1/2 cup dry white wine
1 shallot, finely diced
3 tbsp butter
2 tbsp olive oil
1/2 cup grated parmesan
2 cloves garlic, minced
Fresh thyme
Salt and pepper to taste`,
    steps: `1. Heat stock in a saucepan and keep warm over low heat.

2. In a large pan, sauté mushrooms in 1 tbsp butter and olive oil until golden. Set aside.

3. In the same pan, add remaining butter and sauté shallots until soft. Add garlic and cook 1 minute.

4. Add arborio rice and toast for 2 minutes, stirring constantly.

5. Pour in white wine and stir until absorbed.

6. Add warm stock one ladle at a time, stirring constantly. Wait until each addition is absorbed before adding more.

7. After about 18-20 minutes, rice should be creamy but still al dente.

8. Fold in mushrooms, parmesan, and fresh thyme. Season with salt and pepper.

9. Let rest for 2 minutes before serving.`,
    notes: `The constant stirring releases starch from the rice, creating that signature creamy texture. Don't rush this dish - it's a labor of love!`,
  },
  {
    id: 'placeholder-5',
    title: 'Japanese Chicken Katsu',
    description: 'Crispy panko-breaded chicken cutlet served with tonkatsu sauce and shredded cabbage.',
    cuisine_type: 'Japanese',
    prep_time: 30,
    user_name: 'Yuki Tanaka',
    user_id: 'user-4',
    avg_rating: 4.7,
    created_at: '2024-02-15',
    ingredients: `2 boneless chicken breasts
1 cup panko breadcrumbs
1/2 cup all-purpose flour
2 eggs, beaten
Salt and pepper
Vegetable oil for frying
Shredded cabbage

For tonkatsu sauce:
4 tbsp ketchup
2 tbsp Worcestershire sauce
1 tbsp soy sauce
1 tsp sugar`,
    steps: `1. Butterfly each chicken breast and pound to 1/2 inch thickness. Season with salt and pepper.

2. Set up breading station: flour, beaten eggs, and panko in separate shallow dishes.

3. Dredge chicken in flour, shaking off excess. Dip in egg, then coat thoroughly in panko, pressing to adhere.

4. Heat 1 inch of oil in a deep pan to 350°F (175°C).

5. Fry chicken for 4-5 minutes per side until golden brown and cooked through (internal temp 165°F).

6. Rest on a wire rack for 2 minutes, then slice into strips.

7. Mix sauce ingredients together.

8. Serve katsu over shredded cabbage with tonkatsu sauce drizzled on top.`,
    notes: `For extra crispy katsu, double-bread by dipping in egg and panko twice. The resting time on a rack keeps the bottom from getting soggy.`,
  },
  {
    id: 'placeholder-6',
    title: 'Mediterranean Falafel Bowl',
    description: 'Crispy chickpea falafel with hummus, tabbouleh, pickled vegetables, and tahini.',
    cuisine_type: 'Mediterranean',
    prep_time: 50,
    user_name: 'Sarah Ahmed',
    user_id: 'user-5',
    avg_rating: 4.4,
    created_at: '2024-02-20',
    ingredients: `For falafel:
2 cans chickpeas, drained
1 onion, quartered
4 cloves garlic
1 cup fresh parsley
1 cup fresh cilantro
1 tsp cumin
1 tsp coriander
1/4 tsp cayenne
3 tbsp flour
Salt to taste
Oil for frying

For bowl:
Hummus
Tabbouleh
Pickled turnips
Cucumber
Tomatoes
Tahini sauce
Pita bread`,
    steps: `1. Pulse chickpeas, onion, garlic, parsley, and cilantro in a food processor until combined but not pureed. Should be textured.

2. Add spices, flour, and salt. Pulse to combine. Refrigerate mixture for 30 minutes.

3. Form mixture into small patties or balls.

4. Heat 2 inches of oil to 350°F (175°C). Fry falafel for 3-4 minutes until deep golden brown.

5. Drain on paper towels.

6. Assemble bowls: spread hummus on the bottom, add tabbouleh, cucumber, tomatoes, and pickled vegetables.

7. Top with hot falafel and drizzle with tahini sauce. Serve with warm pita.`,
    notes: `Using dried chickpeas (soaked overnight) instead of canned gives a better texture, but canned works in a pinch. Add a bit more flour if mixture is too wet.`,
  },
  {
    id: 'placeholder-7',
    title: 'French Onion Soup',
    description: 'Classic caramelized onion soup with crusty bread and melted gruyère cheese.',
    cuisine_type: 'French',
    prep_time: 60,
    user_name: 'Jean Pierre',
    user_id: 'user-6',
    avg_rating: 4.8,
    created_at: '2024-02-25',
    ingredients: `4 large yellow onions, thinly sliced
4 tbsp butter
2 tbsp olive oil
1 tsp sugar
6 cups beef stock
1 cup dry white wine
2 cloves garlic, minced
2 sprigs fresh thyme
1 bay leaf
Salt and pepper to taste
1 baguette, sliced
2 cups gruyère cheese, shredded`,
    steps: `1. Melt butter with olive oil in a large Dutch oven over medium heat.

2. Add sliced onions and cook, stirring occasionally, for 10 minutes until softened.

3. Add sugar and reduce heat to medium-low. Continue cooking for 30-40 minutes, stirring every few minutes, until onions are deep golden brown.

4. Add garlic and cook 1 minute. Pour in wine and scrape up any browned bits.

5. Add beef stock, thyme, and bay leaf. Simmer for 20 minutes. Season with salt and pepper.

6. Preheat broiler. Ladle soup into oven-safe bowls.

7. Top each bowl with baguette slices and generous amount of gruyère.

8. Broil for 2-3 minutes until cheese is bubbly and golden.

9. Serve immediately - careful, bowls are hot!`,
    notes: `The secret is patience with the onions. Low and slow caramelization develops deep, sweet flavor. Don't rush this step!`,
  },
  {
    id: 'placeholder-8',
    title: 'Korean Bibimbap',
    description: 'Mixed rice bowl with sautéed vegetables, beef, fried egg, and spicy gochujang sauce.',
    cuisine_type: 'Korean',
    prep_time: 45,
    user_name: 'Min-Ji Park',
    user_id: 'user-7',
    avg_rating: 4.6,
    created_at: '2024-03-01',
    ingredients: `2 cups cooked rice
1/2 lb beef sirloin, sliced thin
1 cup spinach
1 carrot, julienned
1 zucchini, julienned
1 cup bean sprouts
4 shiitake mushrooms, sliced
2 eggs
2 tbsp sesame oil
2 tbsp soy sauce
2 cloves garlic, minced
Gochujang (Korean chili paste)
Toasted sesame seeds
Salt to taste`,
    steps: `1. Marinate beef in 1 tbsp soy sauce, 1 tbsp sesame oil, and garlic for 15 minutes.

2. Blanch spinach and bean sprouts separately. Squeeze dry and season with sesame oil and salt.

3. Sauté carrots, zucchini, and mushrooms separately in a bit of oil. Season each with salt.

4. Cook marinated beef in a hot pan until browned.

5. Fry eggs sunny-side up, keeping yolks runny.

6. Assemble: Place hot rice in bowls. Arrange vegetables and beef in sections on top of rice.

7. Place fried egg in the center. Add a dollop of gochujang.

8. Sprinkle with sesame seeds. Mix everything together before eating!`,
    notes: `For authentic dolsot bibimbap, serve in a hot stone bowl. The rice gets crispy on the bottom. Mix the gochujang well to distribute the spicy-sweet flavor.`,
  },
  {
    id: 'placeholder-9',
    title: 'Classic Beef Burger',
    description: 'Juicy beef patty with lettuce, tomato, cheese, and special sauce on a brioche bun.',
    cuisine_type: 'American',
    prep_time: 25,
    user_name: 'Mike Johnson',
    user_id: 'user-8',
    avg_rating: 4.3,
    created_at: '2024-03-05',
    ingredients: `1 lb ground beef (80/20)
4 brioche buns
4 slices American cheese
4 leaves butter lettuce
1 tomato, sliced
1 red onion, sliced
Dill pickles

For special sauce:
1/2 cup mayonnaise
2 tbsp ketchup
1 tbsp relish
1 tsp mustard
1/2 tsp garlic powder
1/2 tsp paprika
Salt and pepper`,
    steps: `1. Mix special sauce ingredients and refrigerate.

2. Divide beef into 4 portions. Form into patties slightly larger than buns (they shrink). Make a small indent in the center.

3. Season generously with salt and pepper on both sides.

4. Heat a cast iron skillet or grill to high heat.

5. Cook patties for 3-4 minutes per side for medium. Add cheese in the last minute to melt.

6. Toast buns cut-side down on the grill.

7. Assemble: Bottom bun, special sauce, lettuce, patty with cheese, tomato, onion, pickles, more sauce, top bun.

8. Serve immediately with fries!`,
    notes: `Don't press down on the patties while cooking - you'll lose all those delicious juices! Let the meat rest for a minute before assembling.`,
  },
];

export const topCuisines = ['Italian', 'Thai', 'Mexican'];

export function getPlaceholderRecipe(id: string): RecipeDetail | undefined {
  return placeholderRecipes.find(r => r.id === id);
}
