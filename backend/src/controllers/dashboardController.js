import { prisma } from '../index.js';

export const getDashboardData = async (req, res) => {
  try {
    const user = req.user;

    // Fetch all tasks based on role
    let tasks;
    if (user.role === 'admin') {
      tasks = await prisma.task.findMany({
        include: { assignee: true, project: true }
      });
    } else {
      tasks = await prisma.task.findMany({
        where: {
          OR: [
            { assignedTo: user.id },
            { project: { members: { some: { userId: user.id } } } }
          ]
        },
        include: { assignee: true, project: true }
      });
    }

    // Projects based on role
    let projects;
    if (user.role === 'admin') {
      projects = await prisma.project.findMany();
    } else {
      projects = await prisma.project.findMany({
        where: {
          OR: [
            { createdBy: user.id },
            { members: { some: { userId: user.id } } }
          ]
        }
      });
    }

    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    const now = new Date();
    const overdueTasks = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < now).length;

    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;

    // Tasks per user
    const tasksByUser = {};
    tasks.forEach(task => {
      if (task.assignee?.name) {
        tasksByUser[task.assignee.name] = (tasksByUser[task.assignee.name] || 0) + 1;
      }
    });
    const tasksPerUser = Object.entries(tasksByUser).map(([name, count]) => ({ name, count })).slice(0, 5);

    // Recent tasks (last 10)
    const recentTasks = tasks.slice(0, 10).map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee?.name || 'Unassigned',
      project: task.project?.title || 'No Project'
    }));

    const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    const totalProjects = projects.length;
    const totalTeamMembers = await prisma.user.count();

    res.json({
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      totalProjects,
      highPriority,
      mediumPriority,
      lowPriority,
      tasksPerUser,
      recentTasks,
      completionRate,
      totalTeamMembers,
      tasksDueThisWeek: tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= now && dueDate <= new Date(now.setDate(now.getDate() + 7)) && t.status !== 'completed';
      }).length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};