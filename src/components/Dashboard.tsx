import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart2,
} from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Bem-vindo ao Fluorgan. Aqui está o resumo das suas atividades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Clock className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-secondary-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-secondary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Concluídas</p>
              <p className="text-2xl font-bold text-gray-900">48</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Atrasadas</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart2 className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Produtividade</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tarefas Recentes</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium">Tarefa exemplo #{i}</h3>
                <p className="text-sm text-gray-500">Criada há 2 dias</p>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Em progresso
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};