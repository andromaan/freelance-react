import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal";
import {
  useCreateProjectMilestoneMutation,
  useUpdateProjectMilestoneMutation,
} from "../../../../services/project-milestones/project-milestonesApi";
import type { ProjectMilestoneVM, CreateProjectMilestoneVM, UpdateProjectMilestoneVM } from "../../../../types/project-milestone.types";

interface ProjectMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  milestone?: ProjectMilestoneVM; // If provided, we're in EDIT mode
}

const ProjectMilestoneModal: React.FC<ProjectMilestoneModalProps> = ({
  isOpen,
  onClose,
  projectId,
  milestone,
}) => {
  const isEditing = !!milestone;
  
  const [createMilestone, { isLoading: isCreating }] = useCreateProjectMilestoneMutation();
  const [updateMilestone, { isLoading: isUpdating }] = useUpdateProjectMilestoneMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: 0,
    dueDate: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (milestone) {
        setFormData({
          title: milestone.title,
          description: milestone.description,
          amount: milestone.amount,
          dueDate: milestone.dueDate ? new Date(milestone.dueDate).toISOString().split('T')[0] : "",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          amount: 0,
          dueDate: "",
        });
      }
    }
  }, [isOpen, milestone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && milestone?.id) {
        const updatePayload: UpdateProjectMilestoneVM = {
          title: formData.title,
          description: formData.description,
          amount: formData.amount,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        };
        await updateMilestone({ id: milestone.id, data: updatePayload }).unwrap();
      } else {
        const createPayload: CreateProjectMilestoneVM = {
          projectId,
          title: formData.title,
          description: formData.description,
          amount: formData.amount,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        };
        await createMilestone(createPayload).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to save milestone:", error);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Редагувати етап (віху)" : "Створити новий етап"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Назва <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder="Наприклад: Розробка дизайну"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Опис <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder="Деталі етапу..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Сума ({'$'}) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              min="1"
              value={formData.amount || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Термін здачі <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              required
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent"
            disabled={isSubmitting}
          >
            Скасувати
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectMilestoneModal;
