import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLearningPath, Module, Lesson } from '@/services/learningService';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export function useCreateLearningPath() {
  const router = useRouter();
  const { isLoading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Medical' | 'Herbal' | 'Lifestyle'>('Medical');
  const [icon, setIcon] = useState('BookOpen');
  const [modules, setModules] = useState<Module[]>([
    { id: 'm1', title: 'Introduction', lessons: [{ id: 'l1', title: 'Welcome', duration: '5 min', type: 'article' }] }
  ]);

  const addModule = () => {
    const newModule: Module = {
      id: `m${modules.length + 1}`,
      title: '',
      lessons: [{ id: `l1`, title: '', duration: '5 min', type: 'article' }]
    };
    setModules([...modules, newModule]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const updateModuleTitle = (index: number, val: string) => {
    const newModules = [...modules];
    newModules[index].title = val;
    setModules(newModules);
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    const newLesson: Lesson = {
      id: `l${newModules[moduleIndex].lessons.length + 1}`,
      title: '',
      duration: '5 min',
      type: 'article'
    };
    newModules[moduleIndex].lessons.push(newLesson);
    setModules(newModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    if (newModules[moduleIndex].lessons.length > 1) {
      newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      setModules(newModules);
    }
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, val: string) => {
    const newModules = [...modules];
    (newModules[moduleIndex].lessons[lessonIndex] as any)[field] = val;
    setModules(newModules);
  };

  const handleSave = async () => {
    if (!title || !description) {
      showAlert('Missing Information', 'Please provide a valid course title and description.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await createLearningPath({
        title,
        description,
        category,
        icon,
        totalModules: modules.length,
        modules
      });
      showAlert('Course Created', 'The new curriculum has been synchronized with the learning nodes.', 'success');
      setTimeout(() => router.push('/admin/dashboard'), 2000);
    } catch (error) {
      console.error(error);
      showAlert('Action Failed', 'We could not synchronize the new course. Please check your network.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return {
    authLoading,
    loading,
    modalConfig,
    setModalConfig,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    icon,
    setIcon,
    modules,
    addModule,
    removeModule,
    updateModuleTitle,
    addLesson,
    removeLesson,
    updateLesson,
    handleSave,
  };
}
