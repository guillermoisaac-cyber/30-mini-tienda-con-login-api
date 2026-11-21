import {listSync} from '@/lib/sync';import {NextRequest} from 'next/server';export const runtime='nodejs';export async function GET(req:NextRequest){return listSync(req,'favoritos')}
