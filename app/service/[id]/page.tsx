'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import type { Service, ChecklistItem, ChecklistProgress, Remark, Incident } from '@/lib/supabase'

type Phase = 'before_service' | 'during_service' | 'after_service'

const PHASE_LABELS = {
  before_service: 'Avant le Culte',
  during_service: 'Pendant le Culte',
  after_service: 'Après le Culte'
}

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const [service, setService] = useState<Service | null>(null)
  const [currentPhase, setCurrentPhase] = useState<Phase>('before_service')
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [progress, setProgress] = useState<ChecklistProgress[]>([])
  const [remarks, setRemarks] = useState<Remark[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [newRemark, setNewRemark] = useState('')
  const [newIncident, setNewIncident] = useState({ type: 'autre' as const, description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServiceData()
  }, [serviceId])

  const loadServiceData = async () => {
    try {
      // Charger le service
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single()

      if (serviceError) throw serviceError
      setService(serviceData)

      // Charger les items de checklist
      const { data: itemsData, error: itemsError } = await supabase
        .from('checklist_items')
        .select('*')
        .order('display_order')

      if (itemsError) throw itemsError
      setChecklistItems(itemsData || [])

      // Charger la progression
      const { data: progressData, error: progressError } = await supabase
        .from('checklist_progress')
        .select('*')
        .eq('service_id', serviceId)

      if (progressError) throw progressError
      setProgress(progressData || [])

      // Charger les remarques
      const { data: remarksData, error: remarksError } = await supabase
        .from('remarks')
        .select('*')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false })

      if (remarksError) throw remarksError
      setRemarks(remarksData || [])

      // Charger les incidents
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('incidents')
        .select('*')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false })

      if (incidentsError) throw incidentsError
      setIncidents(incidentsData || [])

    } catch (err) {
      console.error('Erreur chargement:', err)
      alert('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  const toggleChecklistItem = async (itemId: string, currentlyChecked: boolean) => {
    try {
      const existingProgress = progress.find(p => p.checklist_item_id === itemId)

      if (existingProgress) {
        // Mettre à jour
        const { error } = await supabase
          .from('checklist_progress')
          .update({ 
            checked: !currentlyChecked,
            checked_at: !currentlyChecked ? new Date().toISOString() : null
          })
          .eq('id', existingProgress.id)

        if (error) throw error
      } else {
        // Créer
        const { error } = await supabase
          .from('checklist_progress')
          .insert({
            service_id: serviceId,
            checklist_item_id: itemId,
            checked: true,
            checked_at: new Date().toISOString()
          })

        if (error) throw error
      }

      await loadServiceData()
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  const addRemark = async () => {
    if (!newRemark.trim()) return

    try {
      const { error } = await supabase
        .from('remarks')
        .insert({
          service_id: serviceId,
          phase: currentPhase,
          content: newRemark
        })

      if (error) throw error

      setNewRemark('')
      await loadServiceData()
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  const addIncident = async () => {
    if (!newIncident.description.trim()) return

    try {
      const { error } = await supabase
        .from('incidents')
        .insert({
          service_id: serviceId,
          type: newIncident.type,
          description: newIncident.description
        })

      if (error) throw error

      setNewIncident({ type: 'autre', description: '' })
      await loadServiceData()
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  const finishService = async () => {
    if (!confirm('Voulez-vous terminer ce service ?')) return

    try {
      const { error } = await supabase
        .from('services')
        .update({ status: 'termine' })
        .eq('id', serviceId)

      if (error) throw error

      router.push('/dashboard')
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  if (!service) {
    return <div className="min-h-screen flex items-center justify-center">Service introuvable</div>
  }

  const currentPhaseItems = checklistItems.filter(item => item.phase === currentPhase)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Retour
            </button>
            <h1 className="text-2xl font-bold">
              Service du {new Date(service.date).toLocaleDateString('fr-FR')}
            </h1>
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation des phases */}
        <div className="mb-6 flex gap-2">
          {(['before_service', 'during_service', 'after_service'] as Phase[]).map((phase) => (
            <button
              key={phase}
              onClick={() => setCurrentPhase(phase)}
              className={`px-4 py-2 rounded-md font-medium ${
                currentPhase === phase
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {PHASE_LABELS[phase]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checklist */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">{PHASE_LABELS[currentPhase]}</h2>
              </div>
              <div className="p-6 space-y-3">
                {currentPhaseItems.map((item) => {
                  const itemProgress = progress.find(p => p.checklist_item_id === item.id)
                  const isChecked = itemProgress?.checked || false

                  return (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleChecklistItem(item.id, isChecked)}
                        className="mt-1 w-5 h-5"
                      />
                      <span className={isChecked ? 'line-through text-gray-500' : ''}>
                        {item.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Remarques et Incidents */}
          <div className="space-y-6">
            {/* Remarques */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold">Remarques</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <textarea
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Ajouter une remarque..."
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                  />
                  <button
                    onClick={addRemark}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  >
                    Ajouter
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {remarks.filter(r => r.phase === currentPhase).map((remark) => (
                    <div key={remark.id} className="p-3 bg-gray-50 rounded text-sm">
                      <div className="text-gray-600 text-xs mb-1">
                        {new Date(remark.created_at).toLocaleTimeString('fr-FR')}
                      </div>
                      <div>{remark.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Incidents */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold">Incidents</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <select
                    value={newIncident.type}
                    onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="larsen">Larsen</option>
                    <option value="micro">Problème Micro</option>
                    <option value="hf">Problème HF</option>
                    <option value="autre">Autre</option>
                  </select>
                  <textarea
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                    placeholder="Description de l'incident..."
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                  />
                  <button
                    onClick={addIncident}
                    className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                  >
                    Signaler
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="p-3 bg-red-50 rounded text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-red-800">{incident.type.toUpperCase()}</span>
                        <span className="text-xs text-gray-600">
                          {new Date(incident.created_at).toLocaleTimeString('fr-FR')}
                        </span>
                      </div>
                      <div className="text-gray-700">{incident.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton terminer le service */}
        {service.status === 'en_cours' && (
          <div className="mt-8 text-center">
            <button
              onClick={finishService}
              className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 font-medium"
            >
              Terminer le Service
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

