import { prisma } from '../index.js';

export const getTasks = async (req, res) => {
  try {
    const user = req.user;
    let tasks;

    if (user.role === 'admin') {
      tasks = await prisma.task.findMany({
        include: {
          project: { select: { id: true, title: true } },
          assignee: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      tasks = await prisma.task.findMany({
        where: {
          OR: [
            { assignedTo: user.id },
            { project: { members: { some: { userId: user.id } } } }
          ]
        },
        include: {
          project: { select: { id: true, title: true } },
          assignee: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId, assignedTo } = req.body;

    if (!title || !dueDate || !projectId || !assignedTo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || '',
        priority: priority || 'medium',
        dueDate: new Date(dueDate),
        status: 'todo',
        projectId: parseInt(projectId),
        assignedTo: parseInt(assignedTo),
        createdBy: req.user.id
      },
      include: {
        project: { select: { id: true, title: true } },
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, title, description, dueDate, assignedTo } = req.body;

    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        status: status || task.status,
        priority: priority || task.priority,
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        assignedTo: assignedTo ? parseInt(assignedTo) : task.assignedTo
      },
      include: {
        project: { select: { id: true, title: true } },
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};