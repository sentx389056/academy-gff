"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Users, ChevronLeft, ChevronRight,
  Trash2, ShieldCheck, GraduationCap, User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "STUDENT" | "ADMIN";
  createdAt: string;
  groups: { id: number; name: string }[];
};

const PAGE_SIZE = 50;

const ROLE_LABEL: Record<string, string> = {
  ADMIN:   "Администратор",
  STUDENT: "Студент",
  USER:    "Пользователь",
};

const ROLE_ICON: Record<string, React.ReactNode> = {
  ADMIN:   <ShieldCheck size={12} />,
  STUDENT: <GraduationCap size={12} />,
  USER:    <User size={12} />,
};

const ROLE_CLASS: Record<string, string> = {
  ADMIN:   "bg-red-100 text-red-700 border-red-200",
  STUDENT: "bg-blue-100 text-blue-700 border-blue-200",
  USER:    "bg-gray-100 text-gray-600 border-gray-200",
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (q: string, s: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q,
        limit: String(PAGE_SIZE),
        skip:  String(s),
      });
      const res = await fetch(`/api/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(query, skip); }, [load, query, skip]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSkip(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(val, 0), 300);
  };

  const handleRoleChange = async (userId: number, role: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)));
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка изменения роли");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId: number, name: string) => {
    if (!confirm(`Удалить пользователя «${name}»? Это действие нельзя отменить.`)) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setTotal((t) => t - 1);
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка удаления");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(skip / PAGE_SIZE) + 1;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={20} className="text-slate-600" />
            <h1 className="text-xl font-bold text-slate-900">Пользователи</h1>
          </div>
          <p className="text-sm text-gray-500">
            {loading ? "Загрузка..." : `${total} пользователей`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Поиск по имени или email..."
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {users.length === 0 && !loading ? (
          <div className="py-16 text-center text-gray-400">
            {query ? "Пользователи не найдены" : "Нет зарегистрированных пользователей"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3">Пользователь</TableHead>
                <TableHead className="px-4 py-3">Роль</TableHead>
                <TableHead className="px-4 py-3">Группы</TableHead>
                <TableHead className="px-4 py-3">Дата регистрации</TableHead>
                <TableHead className="px-4 py-3 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className={deletingId === user.id ? "opacity-40 pointer-events-none" : ""}>
                  {/* Name + email */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role select */}
                  <TableCell className="px-4 py-3">
                    <Select
                      value={user.role}
                      onValueChange={(val) => handleRoleChange(user.id, val)}
                      disabled={updatingId === user.id}
                    >
                      <SelectTrigger className={`h-7 text-xs w-40 border ${ROLE_CLASS[user.role]}`}>
                        <div className="flex items-center gap-1.5">
                          {ROLE_ICON[user.role]}
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">
                          <div className="flex items-center gap-1.5">
                            <User size={12} /> Пользователь
                          </div>
                        </SelectItem>
                        <SelectItem value="STUDENT">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap size={12} /> Студент
                          </div>
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck size={12} /> Администратор
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Groups */}
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.groups.length === 0 ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        user.groups.map((g) => (
                          <Badge
                            key={g.id}
                            className="text-xs bg-slate-100 text-slate-600 border-slate-200 border hover:bg-slate-100 font-normal"
                          >
                            {g.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>

                  {/* Registered date */}
                  <TableCell className="px-4 py-3 text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </TableCell>

                  {/* Delete */}
                  <TableCell className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={14} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Показано {skip + 1}–{Math.min(skip + PAGE_SIZE, total)} из {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              disabled={skip === 0}
              onClick={() => setSkip(Math.max(0, skip - PAGE_SIZE))}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline" size="sm"
              disabled={skip + PAGE_SIZE >= total}
              onClick={() => setSkip(skip + PAGE_SIZE)}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
