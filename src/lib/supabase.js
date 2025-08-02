import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://duqpkttgmldgteeuwubd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1cXBrdHRnbWxkZ3RlZXV3dWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjkyODQsImV4cCI6MjA2OTcwNTI4NH0.KnJ88n8GDXdydNzzTqR-2RXqxBILfpdlea7JFdSqIbg'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions for Prussia Regiment

// Logging Hall Services
export const loggingService = {
  // Low Rank Logging
  async getLowRankLogs() {
    console.log('getLowRankLogs called - fetching from database...');
    const { data, error } = await supabase
      .from('low_rank_logs')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('getLowRankLogs result:', { data, error });
    if (error) throw error
    return data
  },

  async addLowRankLog(logData) {
    const { data, error } = await supabase
      .from('low_rank_logs')
      .insert([logData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateLowRankLog(id, updates) {
    const { data, error } = await supabase
      .from('low_rank_logs')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteLowRankLog(personnelId) {
    const { error } = await supabase
      .from('low_rank_logs')
      .delete()
      .eq('personnel_id', personnelId)
    
    if (error) throw error
  },

  // NCO Logging
  async getNCOLogs() {
    console.log('getNCOLogs called - fetching from database...');
    const { data, error } = await supabase
      .from('nco_logs')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('getNCOLogs result:', { data, error });
    if (error) throw error
    return data
  },

  async addNCOLog(logData) {
    const { data, error } = await supabase
      .from('nco_logs')
      .insert([logData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateNCOLog(id, updates) {
    const { data, error } = await supabase
      .from('nco_logs')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteNCOLog(personnelId) {
    const { error } = await supabase
      .from('nco_logs')
      .delete()
      .eq('personnel_id', personnelId)
    
    if (error) throw error
  },

  // Officer Logging
  async getOfficerLogs() {
    console.log('getOfficerLogs called - fetching from database...');
    const { data, error } = await supabase
      .from('officer_logs')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('getOfficerLogs result:', { data, error });
    if (error) throw error
    return data
  },

  async addOfficerLog(logData) {
    const { data, error } = await supabase
      .from('officer_logs')
      .insert([logData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateOfficerLog(id, updates) {
    const { data, error } = await supabase
      .from('officer_logs')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteOfficerLog(personnelId) {
    const { error } = await supabase
      .from('officer_logs')
      .delete()
      .eq('personnel_id', personnelId)
    
    if (error) throw error
  },

  // Inactivity Notices
  async getInactivityNotices() {
    console.log('getInactivityNotices called - fetching from database...');
    const { data, error } = await supabase
      .from('inactivity_notices')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('getInactivityNotices result:', { data, error });
    if (error) throw error
    return data
  },

  async addInactivityNotice(noticeData) {
    const { data, error } = await supabase
      .from('inactivity_notices')
      .insert([noticeData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateInactivityNotice(id, updates) {
    const { data, error } = await supabase
      .from('inactivity_notices')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Retired Personnel
  async getRetiredPersonnel() {
    console.log('getRetiredPersonnel called - fetching from database...');
    
    // Try different approaches to get the data
    try {
      // First attempt - standard query
      console.log('Attempting to query retired_personnel table...');
      const { data, error } = await supabase
        .from('retired_personnel')
        .select('*')
        .order('retirement_date', { ascending: false })
      
      console.log('getRetiredPersonnel result:', { data, error, dataLength: data?.length });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // If no data, try without ordering
      if (!data || data.length === 0) {
        console.log('No data with ordering, trying without order...');
        console.log('Checking if table exists by trying simple select...');
        const { data: data2, error: error2 } = await supabase
          .from('retired_personnel')
          .select('*')
        
        console.log('getRetiredPersonnel without order:', { data: data2, error: error2, dataLength: data2?.length });
        
        if (error2) throw error2;
        return data2 || [];
      }
      
      return data || [];
      
    } catch (err) {
      console.error('Error in getRetiredPersonnel:', err);
      throw err;
    }
  },

  async addRetiredPersonnel(retiredData) {
    const { data, error } = await supabase
      .from('retired_personnel')
      .insert([retiredData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateRetiredPersonnel(id, updates) {
    const { data, error } = await supabase
      .from('retired_personnel')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Personnel Management
export const personnelService = {
  // Get all active personnel
  async getAllPersonnel() {
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get personnel by category
  async getPersonnelByCategory(category) {
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .eq('category', category)
      .eq('status', 'active')
      .order('rank')
    
    if (error) throw error
    return data
  },

  // Add new personnel
  async addPersonnel(personnelData) {
    const { data, error } = await supabase
      .from('personnel')
      .insert([{
        username: personnelData.username,
        rank: personnelData.rank,
        category: personnelData.category,
        position: personnelData.position,
        date_joined: new Date().toISOString(),
        status: 'active',
        promoted_by: personnelData.promoted_by
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update personnel
  async updatePersonnel(id, updates) {
    console.log('Supabase updatePersonnel called with:', { id, updates });
    
    const { data, error } = await supabase
      .from('personnel')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    console.log('Supabase update result:', data);
    return data[0]
  },

  // Retire personnel
  async retirePersonnel(id, retiredBy) {
    const { data, error } = await supabase
      .from('personnel')
      .update({ 
        status: 'retired',
        retired_by: retiredBy,
        retired_date: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Get regiment statistics
  async getRegimentStats() {
    const { data: allPersonnel, error: allError } = await supabase
      .from('personnel')
      .select('category, status')
      .eq('status', 'active')
    
    if (allError) throw allError

    const stats = {
      totalPersonnel: allPersonnel.length,
      activeOfficers: allPersonnel.filter(p => p.category === 'High Command' || p.category === 'Officer Corps').length,
      activeNCOs: allPersonnel.filter(p => p.category === 'Senior NCOs' || p.category === 'Junior NCOs').length,
      enlisted: allPersonnel.filter(p => p.category === 'Enlisted').length
    }

    return stats
  }
}

// Promotion Logs Management
export const promotionService = {
  // Get all promotion logs
  async getAllPromotions() {
    const { data, error } = await supabase
      .from('promotion_logs')
      .select(`
        *,
        personnel:personnel_id (username)
      `)
      .order('promotion_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add promotion log
  async addPromotion(promotionData) {
    const { data, error } = await supabase
      .from('promotion_logs')
      .insert([{
        personnel_id: promotionData.personnel_id,
        previous_rank: promotionData.previous_rank,
        new_rank: promotionData.new_rank,
        category_change: promotionData.category_change,
        processed_by: promotionData.processed_by,
        promotion_date: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Get promotion statistics
  async getPromotionStats() {
    const { data, error } = await supabase
      .from('promotion_logs')
      .select('promotion_date')
    
    if (error) throw error

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const stats = {
      total: data.length,
      recent: data.filter(p => new Date(p.promotion_date) >= thirtyDaysAgo).length,
      thisMonth: data.filter(p => new Date(p.promotion_date) >= thisMonth).length
    }

    return stats
  }
}

// Activity Logs Management
export const activityService = {
  // Get all activity logs
  async getAllActivities() {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        personnel:personnel_id (username)
      `)
      .order('activity_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add activity log
  async addActivity(activityData) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{
        personnel_id: activityData.personnel_id,
        activity_type: activityData.activity_type,
        details: activityData.details,
        category: activityData.category,
        processed_by: activityData.processed_by,
        activity_date: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Get activity statistics
  async getActivityStats() {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('activity_date, activity_type')
    
    if (error) throw error

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const stats = {
      total: data.length,
      recent: data.filter(a => new Date(a.activity_date) >= sevenDaysAgo).length,
      recruitment: data.filter(a => a.activity_type === 'Recruitment').length
    }

    return stats
  }
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to personnel changes
  subscribeToPersonnel(callback) {
    return supabase
      .channel('personnel_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'personnel' }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to promotion logs
  subscribeToPromotions(callback) {
    return supabase
      .channel('promotion_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'promotion_logs' }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to activity logs
  subscribeToActivities(callback) {
    return supabase
      .channel('activity_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'activity_logs' }, 
        callback
      )
      .subscribe()
  }
}

// Utility functions
export const utils = {
  // Get rank hierarchy for sorting
  getRankOrder(rank) {
    const rankOrder = {
      'Oberst': 1,
      'Oberstleutnant': 2,
      'Major': 3,
      'Hauptmann': 4,
      'Premierleutnant': 5,
      'Sekondeleutnant': 6,
      'Feldwebel': 7,
      'Junker': 8,
      'Sergeant': 9,
      'Korporal': 10,
      'Frei Korporal': 10,
      'Gefreiter': 11,
      'Musketier': 12,
      'Rekrut': 13
    }
    return rankOrder[rank] || 99
  },

  // Format date for display
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },

  // Get category for rank
  getCategoryForRank(rank) {
    const categories = {
      'Oberst': 'High Command',
      'Oberstleutnant': 'High Command',
      'Major': 'High Command',
      'Hauptmann': 'Officer Corps',
      'Premierleutnant': 'Officer Corps',
      'Sekondeleutnant': 'Officer Corps',
      'Feldwebel': 'Senior NCOs',
      'Junker': 'Senior NCOs',
      'Sergeant': 'Junior NCOs',
      'Korporal': 'Junior NCOs',
      'Frei Korporal': 'Enlisted',
      'Gefreiter': 'Enlisted',
      'Musketier': 'Enlisted',
      'Rekrut': 'Enlisted'
    }
    return categories[rank] || 'Enlisted'
  }
}