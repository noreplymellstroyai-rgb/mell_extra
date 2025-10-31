import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'

import { FileService } from './file.service'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/api/uploads'
		})
	],
	providers: [FileService],
	exports: [FileService]
})
export class FileModule {}
