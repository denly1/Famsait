"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface EventFormProps {
  event?: any;
  onSave: (event: any) => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    id: event?.id || `event-${Date.now()}`,
    title: event?.title || "",
    subtitle: event?.subtitle || "",
    date: event?.date || "",
    time: event?.time || "",
    venue: event?.venue || "",
    address: event?.address || "",
    age_limit: event?.age_limit || "18+",
    price: event?.price || 0,
    currency: event?.currency || "₽",
    image: event?.image || "",
    description: event?.description || "",
    lineup: event?.lineup || [],
    features: event?.features || [],
    is_past: event?.is_past || false,
    ticket_url: event?.ticket_url || "",
    ticket_link: event?.ticket_link || "",
  });

  const [lineupInput, setLineupInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addLineupItem = () => {
    if (lineupInput.trim()) {
      setFormData({
        ...formData,
        lineup: [...formData.lineup, lineupInput.trim()],
      });
      setLineupInput("");
    }
  };

  const removeLineupItem = (index: number) => {
    setFormData({
      ...formData,
      lineup: formData.lineup.filter((_: any, i: number) => i !== index),
    });
  };

  const addFeatureItem = () => {
    if (featuresInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featuresInput.trim()],
      });
      setFeaturesInput("");
    }
  };

  const removeFeatureItem = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Название события *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Подзаголовок
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Дата *
          </label>
          <input
            type="text"
            placeholder="01.03.2026"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Время
          </label>
          <input
            type="text"
            placeholder="20:00"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Место проведения
          </label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Адрес
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Возрастное ограничение
          </label>
          <input
            type="text"
            value={formData.age_limit}
            onChange={(e) => setFormData({ ...formData, age_limit: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Цена
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Ссылка на билеты
          </label>
          <input
            type="url"
            value={formData.ticket_url}
            onChange={(e) => setFormData({ ...formData, ticket_url: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_past}
              onChange={(e) => setFormData({ ...formData, is_past: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-text-primary">
              Прошедшее событие
            </span>
          </label>
        </div>
      </div>

      <div>
        <ImageUpload
          label="Изображение события"
          currentImage={formData.image}
          onUpload={(url) => setFormData({ ...formData, image: url })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Описание
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Лайнап (артисты)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={lineupInput}
            onChange={(e) => setLineupInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLineupItem())}
            placeholder="Введите имя артиста"
            className="flex-1 px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={addLineupItem}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Добавить
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.lineup.map((artist: string, index: number) => (
            <div
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary rounded-lg flex items-center gap-2"
            >
              <span>{artist}</span>
              <button
                type="button"
                onClick={() => removeLineupItem(index)}
                className="text-primary hover:text-primary/70"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Особенности
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeatureItem())}
            placeholder="Введите особенность"
            className="flex-1 px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={addFeatureItem}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Добавить
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature: string, index: number) => (
            <div
              key={index}
              className="px-3 py-1 bg-accent/10 text-accent rounded-lg flex items-center gap-2"
            >
              <span>{feature}</span>
              <button
                type="button"
                onClick={() => removeFeatureItem(index)}
                className="text-accent hover:text-accent/70"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
        >
          {event ? "Сохранить изменения" : "Создать событие"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-bg-secondary text-text-primary rounded-lg hover:bg-bg-secondary/80 font-medium"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
