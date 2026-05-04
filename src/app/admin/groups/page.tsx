"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Users, Trash2, Plus, Search, X, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type UserItem = { id: number; name: string; email: string; role: string };
type GroupMember = { id: number; name: string; email: string };
type Group = {
  id: number;
  name: string;
  createdAt: string;
  _count: { users: number; courses: number };
};
type GroupDetail = Group & { users: GroupMember[] };

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Администратор",
  STUDENT: "Студент",
  USER: "Пользователь",
};
const ROLE_COLOR: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  STUDENT: "bg-blue-100 text-blue-700",
  USER: "bg-gray-100 text-gray-600",
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search state per-group (keyed by group id)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserItem[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadGroups = useCallback(async () => {
    const res = await fetch("/api/groups");
    if (res.ok) setGroups(await res.json());
  }, []);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  const loadGroupDetail = useCallback(async (id: number) => {
    const res = await fetch(`/api/groups/${id}`);
    if (res.ok) setGroupDetail(await res.json());
  }, []);

  const toggleExpand = async (id: number) => {
    if (expanded === id) {
      setExpanded(null);
      setGroupDetail(null);
      setSearchQuery("");
      setSearchResults([]);
    } else {
      setExpanded(id);
      setSearchQuery("");
      setSearchResults([]);
      await loadGroupDetail(id);
    }
  };

  // Debounced search
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!q.trim()) { setSearchResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/users?q=${encodeURIComponent(q)}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.users ?? []);
        }
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setCreating(false);
    if (res.ok) {
      setNewName("");
      setSuccess("Группа создана");
      loadGroups();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Ошибка создания");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Удалить группу «${name}»? Пользователи не будут удалены.`)) return;
    await fetch(`/api/groups/${id}`, { method: "DELETE" });
    if (expanded === id) { setExpanded(null); setGroupDetail(null); }
    loadGroups();
  };

  const addUserToGroup = async (user: UserItem) => {
    if (!groupDetail) return;
    const alreadyIn = groupDetail.users.some((u) => u.id === user.id);
    if (alreadyIn) return;
    const newIds = [...groupDetail.users.map((u) => u.id), user.id];
    const res = await fetch(`/api/groups/${groupDetail.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: newIds }),
    });
    if (res.ok) {
      await loadGroupDetail(groupDetail.id);
      loadGroups();
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const removeUserFromGroup = async (userId: number) => {
    if (!groupDetail) return;
    const newIds = groupDetail.users.map((u) => u.id).filter((id) => id !== userId);
    const res = await fetch(`/api/groups/${groupDetail.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: newIds }),
    });
    if (res.ok) {
      await loadGroupDetail(groupDetail.id);
      loadGroups();
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Users size={20} className="text-slate-600" />
          <h1 className="text-xl font-bold text-slate-900">Группы пользователей</h1>
        </div>
        <p className="text-sm text-gray-500">
          Создавайте группы и добавляйте участников для управления доступом к курсам.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50 text-green-700">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Create group */}
      <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex gap-3 items-end">
        <div className="flex-1 space-y-1.5">
          <Label>Новая группа</Label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Например: Студенты ВГИК, Сотрудники ГФФ"
            required
          />
        </div>
        <Button type="submit" disabled={creating}>
          <Plus size={16} className="mr-1" />
          {creating ? "Создание..." : "Создать"}
        </Button>
      </form>

      {/* Groups list */}
      {groups.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white border border-gray-200 rounded-xl">
          Нет групп. Создайте первую группу выше.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <div key={group.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Group header */}
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{group.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {group._count.users} участн. · {group._count.courses} курс.
                  </p>
                </div>
                <button
                  onClick={() => toggleExpand(group.id)}
                  className="text-sm text-gray-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  {expanded === group.id ? "Свернуть" : "Участники"}
                </button>
                <button
                  onClick={() => handleDelete(group.id, group.name)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Expanded: member management */}
              {expanded === group.id && (
                <div className="border-t border-gray-100">
                  {/* Current members */}
                  <div className="p-4 pb-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Участники ({groupDetail?.users.length ?? 0})
                    </p>
                    {!groupDetail ? (
                      <p className="text-sm text-gray-400 pb-4">Загрузка...</p>
                    ) : groupDetail.users.length === 0 ? (
                      <p className="text-sm text-gray-400 pb-4">Нет участников. Добавьте пользователей ниже.</p>
                    ) : (
                      <div className="flex flex-col gap-1 mb-4 max-h-48 overflow-y-auto pr-1">
                        {groupDetail.users.map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg group"
                          >
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 flex-shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                              <p className="text-xs text-gray-500 truncate">{u.email}</p>
                            </div>
                            <button
                              onClick={() => removeUserFromGroup(u.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all rounded"
                              title="Убрать из группы"
                            >
                              <UserMinus size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add user search */}
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Добавить участника
                    </p>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Поиск по имени или email..."
                        className="pl-8 pr-8"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    {/* Search results */}
                    {searchQuery.trim() && (
                      <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                        {searching ? (
                          <div className="p-3 text-sm text-gray-400 text-center">Поиск...</div>
                        ) : searchResults.length === 0 ? (
                          <div className="p-3 text-sm text-gray-400 text-center">
                            Пользователи не найдены
                          </div>
                        ) : (
                          searchResults.map((user) => {
                            const alreadyIn = groupDetail?.users.some((u) => u.id === user.id);
                            return (
                              <button
                                key={user.id}
                                disabled={alreadyIn}
                                onClick={() => addUserToGroup(user)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                                  alreadyIn
                                    ? "bg-gray-50 cursor-not-allowed opacity-50"
                                    : "hover:bg-blue-50 cursor-pointer"
                                }`}
                              >
                                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 flex-shrink-0">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${ROLE_COLOR[user.role] ?? "bg-gray-100 text-gray-500"}`}>
                                  {ROLE_LABEL[user.role] ?? user.role}
                                </span>
                                {alreadyIn && (
                                  <span className="text-xs text-gray-400 flex-shrink-0">уже в группе</span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
