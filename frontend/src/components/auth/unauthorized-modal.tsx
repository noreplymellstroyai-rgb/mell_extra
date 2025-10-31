import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface UnauthorizedModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}
export function UnauthorizedModal({
	open,
	onOpenChange
}: UnauthorizedModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-sm'>
				<div className='flex flex-col items-center gap-y-6 text-center'>
					<div className='space-y-2'>
						<DialogTitle className='text-sm font-normal'>
							Для использования нейросети, пожалуйста, войдите в
							свою учетную запись.
						</DialogTitle>
					</div>
					<div className='flex w-full flex-col'>
						<Link
							href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/auth`}
						>
							<Button className='w-full'>Авторизация</Button>
						</Link>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
