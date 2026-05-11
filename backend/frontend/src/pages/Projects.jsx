import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout"; // IMPORTANT

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        {
          title: formData.title,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project created successfully!");

      setFormData({
        title: "",
        description: "",
      });

      fetchProjects();

    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <h2>Loading Projects...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Projects
        </h1>

        {/* Create Project Form */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-4">
            Create Project
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mb-4"
              required
            />

            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mb-4"
              rows="4"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Create Project
            </button>
          </form>
        </div>

        {/* Project List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Project List
          </h2>

          {projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-xl shadow-md p-5 bg-white"
                >
                  <h3 className="text-lg font-bold">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {project.description ||
                      "No description"}
                  </p>

                  <div className="mt-3 text-sm text-gray-500">
                    Project ID: {project.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Projects;