import { BadRequestException, Injectable } from '@nestjs/common'
import { path as rootPath } from 'app-root-path'
import { ensureDir, remove, writeFile } from 'fs-extra'
import * as path from 'path'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class FileService {
	async saveImage(
		file: Express.Multer.File,
		folder = 'default'
	): Promise<{ url: string; name: string }> {
		if (!file.mimetype.startsWith('image/')) {
			throw new BadRequestException('Поддерживаются только изображения')
		}

		const uploadFolder = path.join(rootPath, 'uploads', folder)
		await ensureDir(uploadFolder)

		const filename = `${uuidv4()}-processed.webp`
		const outputPath = path.join(uploadFolder, filename)

		const buffer = await sharp(file.buffer)
			.resize(1024, 1024, {
				fit: 'inside',
				withoutEnlargement: true
			})
			.webp({ quality: 80 })
			.toBuffer()

		await writeFile(outputPath, buffer)

		return {
			url: `/uploads/${folder}/${filename}`,
			name: filename
		}
	}

	async deleteFile(filePath: string): Promise<void> {
		const fullPath = path.join(rootPath, filePath)
		await remove(fullPath)
	}
}
