import { createClient } from '@supabase/supabase-js'

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!url || !serviceKey || !email || !password) {
    console.error('Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD')
    process.exit(1)
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existing = existingUsers?.users.find(u => u.email === email)

  let userId: string

  if (existing) {
    console.log(`Admin user already exists: ${email}`)
    userId = existing.id
    const { error } = await supabase.auth.admin.updateUserById(userId, { password })
    if (error) {
      console.error('Failed to update password:', error.message)
      process.exit(1)
    }
    console.log('Password updated.')
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (error || !data.user) {
      console.error('Failed to create admin user:', error?.message)
      process.exit(1)
    }
    userId = data.user.id
    console.log(`Created admin user: ${email} (${userId})`)
  }

  // Upsert into admin_users table
  const { error: upsertError } = await supabase
    .from('admin_users')
    .upsert({ id: userId, email }, { onConflict: 'id' })

  if (upsertError) {
    console.error('Failed to upsert admin_users row:', upsertError.message)
    process.exit(1)
  }

  console.log('admin_users row confirmed.')
  console.log(`\nDone! Sign in at /admin/login with:\n  Email: ${email}\n  Password: (as set in ADMIN_PASSWORD)`)
}

main()
