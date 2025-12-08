import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.util';

export const uploadSingle = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json(errorResponse('No file uploaded'));
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json(successResponse('File uploaded successfully', {
      url: fileUrl,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to upload file'));
  }
};

export const uploadMultiple = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json(errorResponse('No files uploaded'));
      return;
    }

    const files = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }));
    
    res.status(200).json(successResponse('Files uploaded successfully', files));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to upload files'));
  }
};
