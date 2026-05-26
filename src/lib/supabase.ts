import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if the Supabase project is the dead default one or missing
const isOfflineMode = !supabaseUrl || 
                      !supabaseAnonKey || 
                      supabaseUrl.includes('ohredmclktqsccxjbrdg.supabase.co');

// Realistic coordinate-accurate Hyderabad tactical mock data
const DEFAULT_NEEDS = [
  {
    id: 'need-1',
    title: 'Medical Supply Request',
    description: 'Requires oxygen cylinder and first aid kits immediately near Sector Alpha.',
    category: 'medical',
    priority: 'critical',
    location: 'HITECH City, Hyderabad',
    latitude: 17.4483,
    longitude: 78.3915,
    status: 'verified',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'need-2',
    title: 'Clean Water Shortage',
    description: 'Water purification tablets and bottled water needed for 50 residents.',
    category: 'water',
    priority: 'high',
    location: 'Banjara Hills, Hyderabad',
    latitude: 17.4126,
    longitude: 78.4483,
    status: 'verified',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'need-3',
    title: 'Temporary Food Depot',
    description: 'Dry rations, milk packets, and baby food packets required.',
    category: 'food',
    priority: 'medium',
    location: 'Charminar, Hyderabad',
    latitude: 17.3616,
    longitude: 78.4747,
    status: 'assigned',
    created_at: new Date(Date.now() - 10800000).toISOString()
  }
];

const DEFAULT_PROFILES = [
  {
    id: 'vol-1',
    full_name: 'Sarah Connor (Medic)',
    email: 'sarah.c@guardian.link',
    role: 'volunteer',
    is_available: true,
    status: 'available',
    location: 'Sector Alpha'
  },
  {
    id: 'vol-2',
    full_name: 'John Miller (Scout)',
    email: 'john.m@guardian.link',
    role: 'volunteer',
    is_available: true,
    status: 'available',
    location: 'Sector Bravo'
  },
  {
    id: 'vol-3',
    full_name: 'Elena Rostova (Rescue)',
    email: 'elena.r@guardian.link',
    role: 'volunteer',
    is_available: false,
    status: 'busy',
    location: 'Sector Charlie'
  }
];

const DEFAULT_VOLUNTEERS = [
  { id: 'vol-1', full_name: 'Sarah Connor (Medic)', is_available: true, status: 'available' },
  { id: 'vol-2', full_name: 'John Miller (Scout)', is_available: true, status: 'available' },
  { id: 'vol-3', full_name: 'Elena Rostova (Rescue)', is_available: false, status: 'busy' }
];

const DEFAULT_MISSIONS = [
  {
    id: 'mission-1',
    need_id: 'need-3',
    volunteer_id: 'vol-3',
    status: 'assigned',
    assigned_at: new Date(Date.now() - 5400000).toISOString()
  }
];

// Initialize localStorage databases if empty
if (isOfflineMode) {
  console.log("🛡️ GuardianLink: Running in Local Sandbox Offline Mode.");
  if (!localStorage.getItem('gl_needs')) {
    localStorage.setItem('gl_needs', JSON.stringify(DEFAULT_NEEDS));
  }
  if (!localStorage.getItem('gl_profiles')) {
    localStorage.setItem('gl_profiles', JSON.stringify(DEFAULT_PROFILES));
  }
  if (!localStorage.getItem('gl_volunteers')) {
    localStorage.setItem('gl_volunteers', JSON.stringify(DEFAULT_VOLUNTEERS));
  }
  if (!localStorage.getItem('gl_missions')) {
    localStorage.setItem('gl_missions', JSON.stringify(DEFAULT_MISSIONS));
  }
}

// Local storage query builder mimicking Supabase syntax
class LocalQueryBuilder {
  private tableName: string;
  private filters: ((item: any) => boolean)[] = [];
  private orderField: string | null = null;
  private orderAsc: boolean = true;
  private limitVal: number | null = null;
  private isHead: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(_columns?: string, options?: { count?: string; head?: boolean }) {
    if (options?.head) {
      this.isHead = true;
    }
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  not(column: string, operator: string, value: any) {
    if (operator === 'is' && value === null) {
      this.filters.push((item) => item[column] !== null && item[column] !== undefined);
    }
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderField = column;
    this.orderAsc = options?.ascending !== false;
    return this;
  }

  limit(count: number) {
    this.limitVal = count;
    return this;
  }

  async then(onfulfilled?: (value: any) => any) {
    try {
      let data = JSON.parse(localStorage.getItem(`gl_${this.tableName}`) || '[]');
      
      // Apply filters
      for (const filter of this.filters) {
        data = data.filter(filter);
      }

      // Resolve joins for nested fields
      if (this.tableName === 'missions') {
        const needsList = JSON.parse(localStorage.getItem('gl_needs') || '[]');
        const volsList = JSON.parse(localStorage.getItem('gl_volunteers') || '[]');
        data = data.map((mission: any) => ({
          ...mission,
          needs: needsList.find((n: any) => n.id === mission.need_id),
          volunteers: volsList.find((v: any) => v.id === mission.volunteer_id)
        }));
      }

      // Apply ordering
      if (this.orderField) {
        data.sort((a: any, b: any) => {
          const valA = a[this.orderField!];
          const valB = b[this.orderField!];
          if (valA < valB) return this.orderAsc ? -1 : 1;
          if (valA > valB) return this.orderAsc ? 1 : -1;
          return 0;
        });
      }

      // Apply limit
      if (this.limitVal !== null) {
        data = data.slice(0, this.limitVal);
      }

      const result = {
        data: this.isHead ? null : data,
        count: data.length,
        error: null,
      };

      if (onfulfilled) {
        return onfulfilled(result);
      }
      return result;
    } catch (err: any) {
      const result = { data: [], count: 0, error: err };
      if (onfulfilled) return onfulfilled(result);
      return result;
    }
  }

  async update(updateData: any) {
    try {
      let allData = JSON.parse(localStorage.getItem(`gl_${this.tableName}`) || '[]');
      let matchedCount = 0;
      allData = allData.map((item: any) => {
        let match = true;
        for (const filter of this.filters) {
          if (!filter(item)) {
            match = false;
            break;
          }
        }
        if (match) {
          matchedCount++;
          return { ...item, ...updateData };
        }
        return item;
      });

      localStorage.setItem(`gl_${this.tableName}`, JSON.stringify(allData));
      return { data: allData, count: matchedCount, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }

  async insert(insertData: any) {
    try {
      let allData = JSON.parse(localStorage.getItem(`gl_${this.tableName}`) || '[]');
      const itemsToInsert = Array.isArray(insertData) ? insertData : [insertData];
      const insertedItems = itemsToInsert.map((item: any) => ({
        id: item.id || `local-${Math.random().toString(36).substr(2, 9)}`,
        created_at: item.created_at || new Date().toISOString(),
        ...item
      }));

      allData = [...insertedItems, ...allData];
      localStorage.setItem(`gl_${this.tableName}`, JSON.stringify(allData));
      return { data: insertedItems, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }
}

// Storage mock to handle uploads locally (converts to Base64 data URLs for offline-backend compatibility)
const localStorageMock = {
  from: (_bucketName: string) => ({
    upload: async (fileName: string, file: File) => {
      return new Promise<{ data: { path: string } | null; error: any }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const base64data = reader.result as string;
            
            // Try storing in localStorage, if it fails (quota limit), use global memory
            try {
              const uploads = JSON.parse(localStorage.getItem('gl_uploads') || '{}');
              uploads[fileName] = base64data;
              localStorage.setItem('gl_uploads', JSON.stringify(uploads));
            } catch (quotaErr) {
              console.warn("🛡️ LocalStorage quota reached. Caching upload in memory instead.");
              (window as any).gl_uploads_memory = (window as any).gl_uploads_memory || {};
              (window as any).gl_uploads_memory[fileName] = base64data;
            }
            
            resolve({ data: { path: fileName }, error: null });
          } catch (err: any) {
            resolve({ data: null, error: err });
          }
        };
        reader.onerror = (err) => {
          resolve({ data: null, error: err });
        };
        reader.readAsDataURL(file);
      });
    },
    getPublicUrl: (path: string) => {
      const uploads = JSON.parse(localStorage.getItem('gl_uploads') || '{}');
      const memoryUploads = (window as any).gl_uploads_memory || {};
      const localUrl = uploads[path] || memoryUploads[path] || path;
      return { data: { publicUrl: localUrl } };
    }
  })
};

// Sandbox mock Supabase Client
const mockSupabaseClient = {
  auth: {
    getUser: async () => ({
      data: {
        user: {
          id: 'vol-1',
          email: 'sarah.c@guardian.link',
          full_name: 'Sarah Connor (Medic)'
        }
      },
      error: null
    })
  },
  from: (tableName: string) => new LocalQueryBuilder(tableName),
  storage: localStorageMock
};

// Export original client if working, otherwise sandbox offline client
export const supabase = isOfflineMode 
  ? (mockSupabaseClient as any)
  : createClient(supabaseUrl, supabaseAnonKey);
