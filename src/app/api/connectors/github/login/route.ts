import { NextResponse } from 'next/server'

export async function GET() {
    const clientId = process.env.GITHUB_CONNECTOR_CLIENT_ID

    if (!clientId) {
        return NextResponse.json(
            { error: 'GITHUB_CONNECTOR_CLIENT_ID non configurato' },
            { status: 500 }
        )
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/connectors/github/callback`
    const scopes = 'repo,read:user'

    const authUrl = new URL('https://github.com/login/oauth/authorize')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', scopes)

    return NextResponse.redirect(authUrl.toString())
}
