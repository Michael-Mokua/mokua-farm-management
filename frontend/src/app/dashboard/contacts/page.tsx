"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Phone, Mail, User, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Contact {
    id: string;
    name: string;
    type: string;
    phone: string;
    email: string;
    notes: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newContact, setNewContact] = useState({
        name: "",
        type: "Customer",
        phone: "",
        email: "",
        notes: ""
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const { data } = await api.get('/contacts');
            setContacts(data);
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateContact = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/contacts', newContact);
            setContacts([...contacts, data]);
            setShowModal(false);
            setNewContact({
                name: "",
                type: "Customer",
                phone: "",
                email: "",
                notes: ""
            });
        } catch (error) {
            console.error("Failed to create contact", error);
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">CRM</h2>
                    <p className="text-muted-foreground">
                        Manage your suppliers and customers.
                    </p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Contact
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contacts Directory</CardTitle>
                    <div className="relative max-w-sm mt-2">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredContacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            {contact.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={contact.type === 'Supplier' ? 'secondary' : 'default'}>
                                            {contact.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1 text-sm">
                                            {contact.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    {contact.phone}
                                                </div>
                                            )}
                                            {contact.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    {contact.email}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                                        {contact.notes}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredContacts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No contacts found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Contact Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 space-y-4 border">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Add New Contact</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleCreateContact} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={newContact.name}
                                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newContact.type}
                                    onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Supplier">Supplier</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={newContact.phone}
                                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newContact.email}
                                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes"
                                    value={newContact.notes}
                                    onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Save Contact</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
