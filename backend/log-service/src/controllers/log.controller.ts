import { Request, Response } from 'express';
import { Log } from '../models/log.model';
import { alertTrigger, aiTrigger } from '../services/index';
import { alertQueue, aiQueue } from '../queue/index';

// Create and store a new log
const createLog = async (req: Request, res: Response) => {
  try {
    const { userId, projectId, level, message, source, meta } = req.body;
    const user = (req as any).user;

    if (!projectId || !level || !message || !source || !meta) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const log = await Log.create({
      // userId: user.userId, 
      // todo : log controler dont have an middleware to connect the user object to the req
      userId,
      projectId,
      level,
      message,
      source,
      meta,
    });

    // ai service queue
    await aiQueue.add('analyze-log',{
      projectId: log.projectId,
      userId: log.userId,
      message: log.message,
      level: log.level,
      source: log.source,
      timestamp: log.createdAt,
    });

    // add alert in alert queue if log level is error or critical 
    if (['error', 'critical'].includes(log.level)) {
      await alertQueue.add('alert-log',{
        projectId: log.projectId,
        userId: log.userId,
        message: log.message,
        level: log.level,
        source: log.source,
        timestamp: log.createdAt,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Log stored successfully',
      logId: log._id,
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Fetch logs for a specific project
const getLogs = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { level, startDate, endDate, limit = 50 } = req.query;
    const user = (req as any).user;

    const filter: any = { userId: user.userId, projectId };
    if (level) filter.level = level;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const logs = await Log.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    return res.json({
      success: true, 
      data: logs 
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Delete all logs of a project
const deleteLogs = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const user = (req as any).user;

    const result = await Log.deleteMany({ userId: user.userId, projectId });
    return res.json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} logs` 
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get summary by log level
const getLogSummary = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const user = (req as any).user;

    const summary = await Log.aggregate([
      { $match: { userId: user.userId, projectId } },
      { $group: { _id: '$level', count: { $sum: 1 } } },
    ]);

    const result: any = { info: 0, warn: 0, error: 0, critical: 0 };
    summary.forEach((s: any) => (result[s._id] = s.count));

    return res.json({ 
      success: true, 
      data: result 
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export = {
  createLog, 
  getLogs, 
  getLogSummary, 
  deleteLogs
}