"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-6 bg-red-800 rounded-full" />
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="p-6 bg-white flex flex-wrap gap-3 items-start">{children}</div>
    </div>
  );
}

const sections = [
  { id: "button", label: "Button" },
  { id: "badge", label: "Badge" },
  { id: "input", label: "Input / Textarea" },
  { id: "checkbox", label: "Checkbox / Switch" },
  { id: "select", label: "Select" },
  { id: "avatar", label: "Avatar" },
  { id: "alert", label: "Alert" },
  { id: "card", label: "Card" },
  { id: "tabs", label: "Tabs" },
  { id: "dialog", label: "Dialog" },
  { id: "dropdown", label: "Dropdown Menu" },
  { id: "accordion", label: "Accordion" },
  { id: "tooltip", label: "Tooltip" },
  { id: "table", label: "Table" },
  { id: "progress", label: "Progress" },
  { id: "skeleton", label: "Skeleton" },
  { id: "separator", label: "Separator" },
];

export default function ComponentsDocsPage() {
  const [switchVal, setSwitchVal] = useState(false);
  const [checkVal, setCheckVal] = useState(false);
  const [progress] = useState(67);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span>Документация</span>
            <span>/</span>
            <span className="text-white">Компоненты</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">UI Компоненты</h1>
          <p className="text-slate-400 text-sm max-w-lg">
            Библиотека переиспользуемых компонентов интерфейса на основе Radix UI и Tailwind CSS.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar nav */}
          <aside className="hidden lg:block w-52 shrink-0">
            <nav className="sticky top-28 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Содержание</p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-slate-600 hover:text-red-800 py-1 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 space-y-14 min-w-0">

            {/* ── BUTTON ── */}
            <Section id="button" title="Button">
              <Demo title="Variants">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </Demo>
              <Demo title="Sizes">
                <Button size="xs">XSmall</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </Demo>
              <Demo title="Disabled">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Outline disabled</Button>
              </Demo>
            </Section>

            {/* ── BADGE ── */}
            <Section id="badge" title="Badge">
              <Demo title="Variants">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </Demo>
            </Section>

            {/* ── INPUT / TEXTAREA ── */}
            <Section id="input" title="Input / Textarea">
              <Demo title="Input">
                <div className="w-full max-w-sm space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="demo-input">Поле ввода</Label>
                    <Input id="demo-input" placeholder="Введите текст..." />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="demo-input-disabled">Отключено</Label>
                    <Input id="demo-input-disabled" placeholder="Недоступно" disabled />
                  </div>
                </div>
              </Demo>
              <Demo title="Textarea">
                <div className="w-full max-w-sm space-y-1">
                  <Label htmlFor="demo-textarea">Многострочное поле</Label>
                  <Textarea id="demo-textarea" placeholder="Введите длинный текст..." rows={4} />
                </div>
              </Demo>
            </Section>

            {/* ── CHECKBOX / SWITCH ── */}
            <Section id="checkbox" title="Checkbox / Switch">
              <Demo title="Checkbox">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="demo-check"
                    checked={checkVal}
                    onCheckedChange={(v) => setCheckVal(!!v)}
                  />
                  <Label htmlFor="demo-check">Принять условия</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="demo-check-disabled" disabled />
                  <Label htmlFor="demo-check-disabled" className="opacity-50">Отключено</Label>
                </div>
              </Demo>
              <Demo title="Switch">
                <div className="flex items-center gap-3">
                  <Switch
                    id="demo-switch"
                    checked={switchVal}
                    onCheckedChange={setSwitchVal}
                  />
                  <Label htmlFor="demo-switch">{switchVal ? "Включено" : "Выключено"}</Label>
                </div>
              </Demo>
            </Section>

            {/* ── SELECT ── */}
            <Section id="select" title="Select">
              <Demo title="Выпадающий список">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Выберите..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Очное обучение</SelectItem>
                    <SelectItem value="2">Заочное обучение</SelectItem>
                    <SelectItem value="3">Дистанционное</SelectItem>
                  </SelectContent>
                </Select>
              </Demo>
            </Section>

            {/* ── AVATAR ── */}
            <Section id="avatar" title="Avatar">
              <Demo title="Аватар">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                  <AvatarFallback>ИИ</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>АГ</AvatarFallback>
                </Avatar>
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="text-lg">МК</AvatarFallback>
                </Avatar>
              </Demo>
            </Section>

            {/* ── ALERT ── */}
            <Section id="alert" title="Alert">
              <Demo title="Варианты оповещений">
                <div className="w-full space-y-3">
                  <Alert>
                    <AlertTitle>Информация</AlertTitle>
                    <AlertDescription>
                      Приём заявок на программы 2025–2026 учебного года открыт.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>
                      Не удалось отправить заявку. Проверьте корректность данных.
                    </AlertDescription>
                  </Alert>
                </div>
              </Demo>
            </Section>

            {/* ── CARD ── */}
            <Section id="card" title="Card">
              <Demo title="Карточка">
                <Card className="w-72">
                  <CardHeader>
                    <CardTitle>Программа обучения</CardTitle>
                    <CardDescription>Профессиональная переподготовка · 6 мес.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500">
                      Курс по реставрации и оцифровке архивных кинолент.
                    </p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button size="sm">Подать заявку</Button>
                    <Button size="sm" variant="outline">Подробнее</Button>
                  </CardFooter>
                </Card>
              </Demo>
            </Section>

            {/* ── TABS ── */}
            <Section id="tabs" title="Tabs">
              <Demo title="Вкладки">
                <div className="w-full">
                  <Tabs defaultValue="about">
                    <TabsList>
                      <TabsTrigger value="about">О программе</TabsTrigger>
                      <TabsTrigger value="plan">Учебный план</TabsTrigger>
                      <TabsTrigger value="docs">Документы</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="mt-4 text-sm text-slate-600">
                      Программа ориентирована на специалистов в области киноведения и архивного дела.
                    </TabsContent>
                    <TabsContent value="plan" className="mt-4 text-sm text-slate-600">
                      Учебный план включает 12 модулей и итоговую аттестацию.
                    </TabsContent>
                    <TabsContent value="docs" className="mt-4 text-sm text-slate-600">
                      Список документов для поступления доступен в разделе «Документы».
                    </TabsContent>
                  </Tabs>
                </div>
              </Demo>
            </Section>

            {/* ── DIALOG ── */}
            <Section id="dialog" title="Dialog">
              <Demo title="Диалоговое окно">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Открыть диалог</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Подача заявки</DialogTitle>
                      <DialogDescription>
                        Заполните форму для записи на программу обучения. Мы свяжемся с вами в течение 2 рабочих дней.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label>Ваше имя</Label>
                        <Input placeholder="Иванов Иван Иванович" />
                      </div>
                      <div className="space-y-1">
                        <Label>Email</Label>
                        <Input type="email" placeholder="ivan@example.com" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Отправить заявку</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Demo>
            </Section>

            {/* ── DROPDOWN MENU ── */}
            <Section id="dropdown" title="Dropdown Menu">
              <Demo title="Контекстное меню">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Действия
                      <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Управление</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Редактировать</DropdownMenuItem>
                    <DropdownMenuItem>Дублировать</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Удалить</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Demo>
            </Section>

            {/* ── ACCORDION ── */}
            <Section id="accordion" title="Accordion">
              <Demo title="Раскрывающийся список">
                <div className="w-full">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="q1">
                      <AccordionTrigger>Какие документы нужны для поступления?</AccordionTrigger>
                      <AccordionContent>
                        Для поступления необходимы: паспорт, диплом о высшем образовании, фотография 3×4 и заявление установленного образца.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="q2">
                      <AccordionTrigger>Есть ли дистанционный формат?</AccordionTrigger>
                      <AccordionContent>
                        Да, часть программ доступна в дистанционном и смешанном формате обучения.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="q3">
                      <AccordionTrigger>Каков срок обучения?</AccordionTrigger>
                      <AccordionContent>
                        Срок обучения зависит от выбранной программы и составляет от 3 до 18 месяцев.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </Demo>
            </Section>

            {/* ── TOOLTIP ── */}
            <Section id="tooltip" title="Tooltip">
              <Demo title="Подсказки">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Наведите на меня</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Это всплывающая подсказка</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold hover:bg-slate-200 transition-colors">?</button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Справочная информация</p>
                  </TooltipContent>
                </Tooltip>
              </Demo>
            </Section>

            {/* ── TABLE ── */}
            <Section id="table" title="Table">
              <Demo title="Таблица">
                <div className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Программа</TableHead>
                        <TableHead>Формат</TableHead>
                        <TableHead>Срок</TableHead>
                        <TableHead>Стоимость</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        ["Киноведение", "Очное", "12 мес.", "Бесплатно"],
                        ["Реставрация кино", "Смешанное", "6 мес.", "45 000 ₽"],
                        ["Архивное дело", "Дистанционное", "3 мес.", "18 000 ₽"],
                      ].map(([name, format, dur, price]) => (
                        <TableRow key={name}>
                          <TableCell className="font-medium">{name}</TableCell>
                          <TableCell>{format}</TableCell>
                          <TableCell>{dur}</TableCell>
                          <TableCell>{price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Demo>
            </Section>

            {/* ── PROGRESS ── */}
            <Section id="progress" title="Progress">
              <Demo title="Прогресс-бар">
                <div className="w-full space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Выполнение программы</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  <Progress value={30} className="h-2" />
                  <Progress value={100} className="h-1.5" />
                </div>
              </Demo>
            </Section>

            {/* ── SKELETON ── */}
            <Section id="skeleton" title="Skeleton">
              <Demo title="Заглушка загрузки">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-36 h-4" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                </div>
                <div className="w-full space-y-2">
                  <Skeleton className="w-full h-32 rounded-xl" />
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
              </Demo>
            </Section>

            {/* ── SEPARATOR ── */}
            <Section id="separator" title="Separator">
              <Demo title="Разделители">
                <div className="w-full space-y-4">
                  <div className="text-sm text-slate-700">Контент выше</div>
                  <Separator />
                  <div className="text-sm text-slate-700">Контент ниже</div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-700">Лево</span>
                    <Separator orientation="vertical" className="h-5" />
                    <span className="text-sm text-slate-700">Право</span>
                    <Separator orientation="vertical" className="h-5" />
                    <span className="text-sm text-slate-700">Ещё</span>
                  </div>
                </div>
              </Demo>
            </Section>

          </main>
        </div>
      </div>
    </div>
  );
}
