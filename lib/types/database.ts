// Types gerados do Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          role: 'client' | 'admin' | 'colaborador' | 'admin_principal'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      inventory_items: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          sku: string | null
          quantity: number
          min_quantity: number
          unit_cost: number
          supplier: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inventory_items']['Row']>
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string | null
          base_price: number
          sale_price: number | null
          production_time_minutes: number
          is_customizable: boolean
          is_active: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Row']>
      }
      product_components: {
        Row: {
          id: string
          product_id: string
          inventory_item_id: string
          quantity: number
          is_required: boolean
        }
        Insert: Omit<Database['public']['Tables']['product_components']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['product_components']['Row']>
      }
      orders: {
        Row: {
          id: string
          order_number: number
          user_id: string | null
          status: 'orcamento' | 'confirmado' | 'em_producao' | 'pronto' | 'enviado' | 'entregue' | 'cancelado'
          production_status: 'nao_iniciado' | 'em_producao' | 'finalizado' | 'controle_qualidade'
          payment_status: 'pendente' | 'parcial' | 'pago' | 'reembolsado'
          subtotal: number
          discount: number
          shipping_cost: number
          total: number
          estimated_delivery: string | null
          actual_delivery: string | null
          shipping_address_id: string | null
          internal_notes: string | null
          customer_notes: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'order_number' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Row']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          name: string
          description: string | null
          quantity: number
          unit_price: number
          total_price: number
          customization: Record<string, any> | null
          production_completed: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['order_items']['Row']>
      }
      order_item_components: {
        Row: {
          id: string
          order_item_id: string
          inventory_item_id: string
          quantity: number
          unit_price: number
        }
        Insert: Omit<Database['public']['Tables']['order_item_components']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_item_components']['Row']>
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string
          street: string
          number: string | null
          complement: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          is_default: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['addresses']['Row']>
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          quantity: number
          customization: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cart_items']['Row']>
      }
      financial_transactions: {
        Row: {
          id: string
          type: 'receita' | 'despesa'
          category: string
          description: string | null
          amount: number
          order_id: string | null
          date: string
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['financial_transactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['financial_transactions']['Row']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'pedido' | 'orcamento' | 'sistema' | 'entrega' | 'pagamento'
          title: string
          message: string | null
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          display_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Row']>
      }
      pricing_rules: {
        Row: {
          id: string
          name: string
          description: string | null
          markup_percentage: number
          min_profit_margin: number
          labor_cost_per_hour: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pricing_rules']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pricing_rules']['Row']>
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: Record<string, any> | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['system_settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['system_settings']['Row']>
      }
    }
  }
}
