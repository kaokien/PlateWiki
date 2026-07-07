/**
 * Utility to parse technique descriptions and steps based on stance.
 * 
 * Since the data is written primarily using "Lead" and "Rear" (which are universally applicable),
 * the core mechanics don't change. However, appending the actual physical hand (Left/Right)
 * dramatically helps beginners.
 * 
 * Orthodox: Lead = Left, Rear = Right
 * Southpaw: Lead = Right, Rear = Left
 */

export function parseStanceText(text: string, isSouthpaw: boolean): string;
export function parseStanceText(text: string | null | undefined, isSouthpaw: boolean): string | null | undefined;
export function parseStanceText(text: string | null | undefined, isSouthpaw: boolean): string | null | undefined {
  if (!text) return text;
  if (!isSouthpaw) return text; // Orthodox is default, no parsing needed if we don't want to enforce left/right injections.

  // If Southpaw is active, we specifically inject the correct hand identifiers
  // or flip specific hardcoded instances of left/right if they exist.
  
  let parsed = text;

  // Replace explicit right/left mentions that are stance-dependent
  // (Note: this is basic and assumes the context is the athlete's body, not general directions)
  // We use word boundaries \b to avoid matching parts of other words.
  
  // Actually, since we used Lead/Rear in the data, the best approach for the toggle 
  // is to dynamically append the hand to make it extremely clear for the user.
  
  // For Southpaw: Lead is Right, Rear is Left
  parsed = parsed.replace(/\blead hand\b/gi, 'lead hand (right)');
  parsed = parsed.replace(/\blead foot\b/gi, 'lead foot (right)');
  parsed = parsed.replace(/\blead leg\b/gi, 'lead leg (right)');
  parsed = parsed.replace(/\blead shoulder\b/gi, 'lead shoulder (right)');
  parsed = parsed.replace(/\brear hand\b/gi, 'rear hand (left)');
  parsed = parsed.replace(/\brear foot\b/gi, 'rear foot (left)');
  parsed = parsed.replace(/\brear leg\b/gi, 'rear leg (left)');
  parsed = parsed.replace(/\brear shoulder\b/gi, 'rear shoulder (left)');
  parsed = parsed.replace(/\borthodox\b/gi, 'southpaw');
  
  // Fix the "Overhand Right" title
  parsed = parsed.replace(/Overhand Right/g, 'Overhand Left');
  
  // Fix liver shot advice (Orthodox targets liver with lead hook, Southpaw targets it with straight left / rear hand)
  if (parsed.includes('The liver is on the opponent\'s RIGHT side — aim your lead hook there')) {
    parsed = parsed.replace('aim your lead hook there', 'aim your straight left / rear uppercut there');
  }

  // Capitalize properly if we injected mid-sentence at the start
  parsed = parsed.replace(/^([a-z])/, (match: string) => match.toUpperCase());

  return parsed;
}
