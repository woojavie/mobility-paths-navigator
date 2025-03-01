import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AccessibilityPoint = Database["public"]["Tables"]["accessibility_points"]["Insert"];
type AccessibilityIssue = Database["public"]["Tables"]["accessibility_issues"]["Insert"];

export const communityService = {
  // Accessibility Points
  async getAccessibilityPoints() {
    const { data, error } = await supabase
      .from('accessibility_points')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addAccessibilityPoint(point: Omit<AccessibilityPoint, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('accessibility_points')
      .insert({
        ...point,
        updated_at: new Date().toISOString(),
        verified: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAccessibilityPoint(id: string, updates: Partial<AccessibilityPoint>) {
    const { data, error } = await supabase
      .from('accessibility_points')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Accessibility Issues
  async getAccessibilityIssues() {
    const { data, error } = await supabase
      .from('accessibility_issues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async reportAccessibilityIssue(issue: Omit<AccessibilityIssue, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('accessibility_issues')
      .insert({
        ...issue,
        updated_at: new Date().toISOString(),
        verified: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAccessibilityIssue(id: string, updates: Partial<AccessibilityIssue>) {
    const { data, error } = await supabase
      .from('accessibility_issues')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Nearby Points and Issues
  async getNearbyPoints(latitude: number, longitude: number, radiusInMeters: number = 1000) {
    const { data, error } = await supabase
      .from('accessibility_points')
      .select('*')
      .filter('latitude', 'gte', latitude - 0.01)
      .filter('latitude', 'lte', latitude + 0.01)
      .filter('longitude', 'gte', longitude - 0.01)
      .filter('longitude', 'lte', longitude + 0.01);

    if (error) throw error;
    return data;
  },

  async getNearbyIssues(latitude: number, longitude: number, radiusInMeters: number = 1000) {
    const { data, error } = await supabase
      .from('accessibility_issues')
      .select('*')
      .filter('latitude', 'gte', latitude - 0.01)
      .filter('latitude', 'lte', latitude + 0.01)
      .filter('longitude', 'gte', longitude - 0.01)
      .filter('longitude', 'lte', longitude + 0.01);

    if (error) throw error;
    return data;
  }
}; 