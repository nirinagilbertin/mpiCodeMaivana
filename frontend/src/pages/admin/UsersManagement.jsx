import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { FadeIn, Card, Button, Loader, Modal, Input } from '../../components';
import { UserCheck, UserX, Trash2, Search } from 'lucide-react';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'status' or 'delete'

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers({ search });
      setUsers(res.data.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (user, newStatus) => {
    try {
      await adminService.updateUserStatus(user.id, newStatus);
      fetchUsers();
      setActionModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (user) => {
    try {
      await adminService.deleteUser(user.id);
      fetchUsers();
      setActionModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <FadeIn>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher par nom, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" icon={Search}>Rechercher</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Rôle</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.fullName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role === 'admin' ? 'Admin' : 'Citoyen'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => { setSelectedUser(user); setActionModal('status'); }}
                      className={`p-1 rounded ${user.isActive ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                    </button>
                    <button
                      onClick={() => { setSelectedUser(user); setActionModal('delete'); }}
                      className="p-1 rounded text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={!!actionModal} onClose={() => setActionModal(null)} title="Confirmation">
          {actionModal === 'status' && selectedUser && (
            <div>
              <p>{selectedUser.isActive ? 'Désactiver' : 'Activer'} l'utilisateur <strong>{selectedUser.fullName}</strong> ?</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setActionModal(null)}>Annuler</Button>
                <Button onClick={() => toggleUserStatus(selectedUser, !selectedUser.isActive)}>Confirmer</Button>
              </div>
            </div>
          )}
          {actionModal === 'delete' && selectedUser && (
            <div>
              <p>Supprimer définitivement l'utilisateur <strong>{selectedUser.fullName}</strong> ? (ses signalements seront également supprimés)</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setActionModal(null)}>Annuler</Button>
                <Button onClick={() => deleteUser(selectedUser)}>Supprimer</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </FadeIn>
  );
};

export default UsersManagement;