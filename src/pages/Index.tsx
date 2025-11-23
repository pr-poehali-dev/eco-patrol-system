import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockReports = [
  { id: 1, title: 'Загрязнение реки в парке Горького', status: 'critical', category: 'Вода', date: '2025-11-20', lat: 55.7308, lng: 37.6017 },
  { id: 2, title: 'Несанкционированная свалка на ул. Ленина', status: 'inProgress', category: 'Отходы', date: '2025-11-21', lat: 55.7387, lng: 37.6032 },
  { id: 3, title: 'Превышение шума от стройки', status: 'resolved', category: 'Шум', date: '2025-11-18', lat: 55.7298, lng: 37.5983 },
  { id: 4, title: 'Выбросы от завода', status: 'critical', category: 'Воздух', date: '2025-11-22', lat: 55.7425, lng: 37.6108 },
  { id: 5, title: 'Незаконная вырубка деревьев', status: 'inProgress', category: 'Зелёные зоны', date: '2025-11-19', lat: 55.7349, lng: 37.5956 },
  { id: 6, title: 'Утечка нефтепродуктов', status: 'critical', category: 'Почва', date: '2025-11-23', lat: 55.7465, lng: 37.6145 },
];

const statsData = [
  { name: 'Янв', reports: 45, resolved: 38 },
  { name: 'Фев', reports: 52, resolved: 41 },
  { name: 'Мар', reports: 61, resolved: 55 },
  { name: 'Апр', reports: 48, resolved: 43 },
  { name: 'Май', reports: 70, resolved: 58 },
  { name: 'Июн', reports: 65, resolved: 62 },
];

const categoryData = [
  { name: 'Вода', value: 28, color: '#0EA5E9' },
  { name: 'Воздух', value: 22, color: '#8B5CF6' },
  { name: 'Отходы', value: 35, color: '#F59E0B' },
  { name: 'Шум', value: 15, color: '#EF4444' },
];

const statusColors = {
  critical: 'bg-red-500',
  inProgress: 'bg-amber-500',
  resolved: 'bg-green-500',
};

const statusLabels = {
  critical: 'Критично',
  inProgress: 'В работе',
  resolved: 'Решено',
};

export default function Index() {
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | null>(null);

  const handleExport = (format: 'pdf' | 'csv') => {
    setExportFormat(format);
    setTimeout(() => {
      const data = mockReports.map(r => ({
        ID: r.id,
        Название: r.title,
        Статус: statusLabels[r.status],
        Категория: r.category,
        Дата: r.date,
      }));

      if (format === 'csv') {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecopatrol_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      } else {
        alert('PDF экспорт: В продакшене здесь будет генерация PDF через backend');
      }
      
      setExportFormat(null);
    }, 500);
  };

  const criticalCount = mockReports.filter(r => r.status === 'critical').length;
  const inProgressCount = mockReports.filter(r => r.status === 'inProgress').length;
  const resolvedCount = mockReports.filter(r => r.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="Leaf" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ЭкоПатруль</h1>
              <p className="text-sm text-muted-foreground">Мониторинг городской экологии</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Icon name="FileDown" size={16} className="mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Icon name="FileText" size={16} className="mr-2" />
              PDF
            </Button>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Новый отчёт
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего отчётов</CardTitle>
              <Icon name="FileText" className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockReports.length}</div>
              <p className="text-xs text-muted-foreground mt-1">За текущий месяц</p>
            </CardContent>
          </Card>

          <Card className="hover-scale border-red-200 bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Критичные</CardTitle>
              <Icon name="AlertTriangle" className="text-red-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{criticalCount}</div>
              <p className="text-xs text-red-600 mt-1">Требуют внимания</p>
            </CardContent>
          </Card>

          <Card className="hover-scale border-amber-200 bg-amber-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">В работе</CardTitle>
              <Icon name="Clock" className="text-amber-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">{inProgressCount}</div>
              <p className="text-xs text-amber-600 mt-1">В процессе решения</p>
            </CardContent>
          </Card>

          <Card className="hover-scale border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Решено</CardTitle>
              <Icon name="CheckCircle" className="text-green-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{resolvedCount}</div>
              <p className="text-xs text-green-600 mt-1">За последнюю неделю</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="analytics">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Icon name="List" size={16} className="mr-2" />
              Отчёты
            </TabsTrigger>
            <TabsTrigger value="map">
              <Icon name="Map" size={16} className="mr-2" />
              Карта
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} className="text-primary" />
                    Динамика отчётов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={statsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="reports" stroke="#0EA5E9" name="Отчёты" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="#22C55E" name="Решено" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="PieChart" size={20} className="text-primary" />
                    Категории проблем
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart" size={20} className="text-primary" />
                    Сравнение по месяцам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reports" fill="#0EA5E9" name="Всего отчётов" />
                      <Bar dataKey="resolved" fill="#22C55E" name="Решено" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="List" size={20} className="text-primary" />
                    Список отчётов
                  </span>
                  <Badge variant="secondary">{mockReports.length} отчётов</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer ${
                        selectedReport === report.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${statusColors[report.status]} text-white`}>
                              {statusLabels[report.status]}
                            </Badge>
                            <Badge variant="outline">{report.category}</Badge>
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {report.date}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Icon name="ChevronRight" size={20} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MapPin" size={20} className="text-primary" />
                  Интерактивная карта отчётов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[600px] bg-muted rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Icon name="Map" size={64} className="text-primary mx-auto" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Интерактивная карта</h3>
                        <p className="text-muted-foreground mb-4">
                          Здесь будет отображаться карта с маркерами проблемных зон
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {mockReports.map((report) => (
                            <div
                              key={report.id}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-border hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className={`w-3 h-3 rounded-full ${statusColors[report.status]}`} />
                              <span className="text-sm font-medium">{report.category}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Mail" size={18} />
                Контакты
              </h3>
              <p className="text-sm text-muted-foreground">Email: info@ecopatrol.ru</p>
              <p className="text-sm text-muted-foreground">Телефон: +7 (495) 123-45-67</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Info" size={18} />
                О системе
              </h3>
              <p className="text-sm text-muted-foreground">
                ЭкоПатруль — современная система мониторинга экологических проблем города
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="BarChart" size={18} />
                Статистика
              </h3>
              <p className="text-sm text-muted-foreground">Отчётов обработано: 347</p>
              <p className="text-sm text-muted-foreground">Проблем решено: 289</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
