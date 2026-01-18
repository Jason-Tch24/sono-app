'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { Service } from '@/lib/supabase'

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    loadServices()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/')
      return
    }
    setUser(user)
  }

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('date', { ascending: false })
        .limit(10)

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      console.error('Erreur chargement services:', err)
    } finally {
      setLoading(false)
    }
  }

  const createNewService = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('services')
        .insert({
          date: today,
          user_id: user.id,
          status: 'en_cours'
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        router.push(`/service/${data.id}`)
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sono Église</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={createNewService}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            + Nouveau Service
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Historique des Services</h2>
          </div>
          
          <div className="divide-y">
            {services.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Aucun service enregistré
              </div>
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/service/${service.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {new Date(service.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        Créé le {new Date(service.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        service.status === 'termine' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {service.status === 'termine' ? 'Terminé' : 'En cours'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

