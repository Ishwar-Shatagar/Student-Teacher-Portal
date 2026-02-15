
// Fix: Declare Deno global for TypeScript environment that doesn't natively support Deno types
declare const Deno: any;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// NOTE: You need to set FCM_SERVER_KEY in your Supabase secrets
const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  const payload = await req.json()
  
  // This function expects to be called by a Database Webhook on insert into 'announcement_delivery'
  // OR directly via client if you prefer.
  // Assuming payload is the record from announcement_delivery + announcement details joined manually or via webhook payload.
  
  const { record } = payload // The inserted announcement_delivery record
  
  if (!record) {
     return new Response(JSON.stringify({ error: 'No record found' }), { status: 400 })
  }

  // Fetch the full announcement and faculty token details
  const { data: deliveryData, error } = await supabase
    .from('announcement_delivery')
    .select(`
      id,
      announcement:announcements(title, body, urgent),
      faculty:faculty(fcm_tokens)
    `)
    .eq('id', record.id)
    .single()

  if (error || !deliveryData) {
      return new Response(JSON.stringify({ error: 'Failed to fetch details' }), { status: 500 })
  }

  const { announcement, faculty } = deliveryData

  // Only send push if urgent (as per requirement) or logic dictates
  if (announcement.urgent && faculty.fcm_tokens && faculty.fcm_tokens.length > 0) {
      const message = {
          registration_ids: faculty.fcm_tokens,
          notification: {
              title: announcement.title,
              body: announcement.body,
              icon: '/icon.png'
          },
          data: {
              type: 'announcement',
              id: record.announcement_id
          }
      }

      await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
              'Authorization': `key=${FCM_SERVER_KEY}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
      })
  }

  return new Response(
    JSON.stringify({ message: 'Processed' }),
    { headers: { "Content-Type": "application/json" } },
  )
})