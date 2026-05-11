import { prisma } from '../index.js';

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const user = req.user;
    let projects;

    if (user.role === 'admin') {
      projects = await prisma.project.findMany({
        include: {
          creator: { select: { id: true, name: true, email: true } },
          members: {
            include: { user: { select: { id: true, name: true, email: true } } }
          },
          tasks: {
            include: {
              assignee: { select: { id: true, name: true } },
              creator: { select: { id: true, name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          OR: [
            { createdBy: user.id },
            { members: { some: { userId: user.id } } }
          ]
        },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          members: {
            include: { user: { select: { id: true, name: true, email: true } } }
          },
          tasks: {
            include: {
              assignee: { select: { id: true, name: true } },
              creator: { select: { id: true, name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(projects);
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } }
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
            creator: { select: { id: true, name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    const isMember = project.members.some(m => m.userId === user.id);
    if (project.createdBy !== user.id && !isMember && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error in getProjectById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create project
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description || '',
        createdBy: req.user.id
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } }
        },
        tasks: true
      }
    });

    // Add creator as member
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: req.user.id
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title: title?.trim(),
        description: description || ''
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } }
        },
        tasks: true
      }
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all tasks first (due to foreign key constraints)
    await prisma.task.deleteMany({
      where: { projectId: parseInt(id) }
    });

    // Delete all project members
    await prisma.projectMember.deleteMany({
      where: { projectId: parseInt(id) }
    });

    // Delete the project
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add member to project
export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingMember = await prisma.projectMember.findFirst({
      where: {
        projectId: parseInt(id),
        userId: user.id
      }
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User already in project' });
    }

    await prisma.projectMember.create({
      data: {
        projectId: parseInt(id),
        userId: user.id
      }
    });

    res.json({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Error in addMember:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove member from project
export const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (project.createdBy === parseInt(userId)) {
      return res.status(400).json({ message: 'Cannot remove project creator' });
    }

    await prisma.projectMember.deleteMany({
      where: {
        projectId: parseInt(id),
        userId: parseInt(userId)
      }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error in removeMember:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get project members
export const getProjectMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project.members);
  } catch (error) {
    console.error('Error in getProjectMembers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};