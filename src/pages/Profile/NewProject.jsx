import ProjectForm from "./ProjectForm";
import "./NewProject.css";

const NewProject = () => {
  return (
    <div className="new-project-page">
      <header className="new-project-header">
        <h2>✏️ Crear nuevo proyecto</h2>
      </header>
      <section className="new-project-form">
        <ProjectForm />
      </section>
    </div>
  );
};

export default NewProject;
