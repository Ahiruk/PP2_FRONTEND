import ProjectForm from './ProjectForm';

const NewProject = () => {
  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo proyecto</h2>
      <ProjectForm />
    </div>
  );
};

export default NewProject;
