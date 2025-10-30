import SessionChat from '@/components/chat/session-chat'

export default async function ChatPage({
	params
}: {
	params: { sessionId: string }
}) {
	const { sessionId } = await params

	return <SessionChat sessionId={sessionId} />
}
