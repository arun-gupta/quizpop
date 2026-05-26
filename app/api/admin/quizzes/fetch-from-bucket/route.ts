import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { bucketPath } = await req.json()
    if (!bucketPath || typeof bucketPath !== 'string') {
      return NextResponse.json({ error: 'bucketPath required (e.g. "quiz-images/mihir")' }, { status: 400 })
    }

    const slashIdx = bucketPath.indexOf('/')
    if (slashIdx === -1) {
      return NextResponse.json({ error: 'bucketPath must include a folder: "bucket-name/folder"' }, { status: 400 })
    }
    const bucket = bucketPath.slice(0, slashIdx)
    const folder = bucketPath.slice(slashIdx + 1)

    const supabase = createServiceClient()

    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(folder)

    if (listError) {
      return NextResponse.json({ error: `Cannot list storage: ${listError.message}` }, { status: 400 })
    }

    const mdFile = files?.find(f => f.name.endsWith('.md'))
    if (!mdFile) {
      return NextResponse.json({ error: `No .md file found in ${bucketPath}` }, { status: 404 })
    }

    const { data: blob, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(`${folder}/${mdFile.name}`)

    if (downloadError || !blob) {
      return NextResponse.json({ error: `Cannot download ${mdFile.name}: ${downloadError?.message}` }, { status: 400 })
    }

    const markdown = await blob.text()
    return NextResponse.json({ markdown, filename: mdFile.name })
  } catch (err) {
    console.error('fetch-from-bucket error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
