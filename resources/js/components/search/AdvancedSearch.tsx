import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, DollarSign, Filter, Home, MapPin, Search, Users } from 'lucide-react';
import { useState } from 'react';

interface SearchFilters {
    location: string;
    priceMin: string;
    priceMax: string;
    propertyType: string;
    genderPolicy: string;
    amenities: string[];
}

interface AdvancedSearchProps {
    onSearch: (query: string, filters: SearchFilters) => void;
    className?: string;
}

export default function AdvancedSearch({ onSearch, className = '' }: AdvancedSearchProps) {
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        location: '',
        priceMin: '',
        priceMax: '',
        propertyType: '',
        genderPolicy: '',
        amenities: [],
    });

    const amenityOptions = [
        { id: 'wifi', label: 'WiFi' },
        { id: 'ac', label: 'Air Conditioning' },
        { id: 'laundry', label: 'Laundry' },
        { id: 'parking', label: 'Parking' },
        { id: 'security', label: '24/7 Security' },
        { id: 'kitchen', label: 'Kitchen Access' },
        { id: 'study', label: 'Study Area' },
        { id: 'gym', label: 'Gym/Fitness' },
    ];

    const locations = ['Malate, Manila', 'Ermita, Manila', 'Taft Avenue, Manila', 'Harrison Street, Manila', 'Paco, Manila', 'Intramuros, Manila'];

    const handleSearch = () => {
        onSearch(query, filters);
    };

    const toggleAmenity = (amenityId: string) => {
        setFilters((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenityId) ? prev.amenities.filter((id) => id !== amenityId) : [...prev.amenities, amenityId],
        }));
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            priceMin: '',
            priceMax: '',
            propertyType: '',
            genderPolicy: '',
            amenities: [],
        });
    };

    const hasActiveFilters = Object.values(filters).some((value) => (Array.isArray(value) ? value.length > 0 : value !== ''));

    return (
        <Card className={className}>
            <CardContent className="p-6">
                {/* Main Search Bar */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by location, school, or dorm name..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                            <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="relative">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                    {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                                    {hasActiveFilters && <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500" />}
                                </Button>
                            </CollapsibleTrigger>
                        </Collapsible>
                        <Button onClick={handleSearch}>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </div>

                {/* Collapsible Filters */}
                <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                    <CollapsibleContent className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center justify-between md:col-span-2 lg:col-span-3">
                                <h4 className="font-medium">Search Filters</h4>
                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
                                        Clear All
                                    </Button>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <MapPin className="h-4 w-4" />
                                    Location
                                </label>
                                <Select value={filters.location} onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem key={location} value={location}>
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <DollarSign className="h-4 w-4" />
                                    Price Range (₱)
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Min"
                                        value={filters.priceMin}
                                        onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
                                        type="number"
                                    />
                                    <Input
                                        placeholder="Max"
                                        value={filters.priceMax}
                                        onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                                        type="number"
                                    />
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <Home className="h-4 w-4" />
                                    Property Type
                                </label>
                                <Select
                                    value={filters.propertyType}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, propertyType: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dormitory">Dormitory</SelectItem>
                                        <SelectItem value="apartment">Apartment</SelectItem>
                                        <SelectItem value="bedspace">Bed Space</SelectItem>
                                        <SelectItem value="homestay">Homestay</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Gender Policy */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <Users className="h-4 w-4" />
                                    Gender Policy
                                </label>
                                <Select
                                    value={filters.genderPolicy}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, genderPolicy: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select policy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="co-ed">Co-ed</SelectItem>
                                        <SelectItem value="male_only">Male Only</SelectItem>
                                        <SelectItem value="female_only">Female Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Amenities */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Amenities</label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {amenityOptions.map((amenity) => (
                                        <Badge
                                            key={amenity.id}
                                            variant={filters.amenities.includes(amenity.id) ? 'default' : 'outline'}
                                            className="cursor-pointer justify-center text-xs"
                                            onClick={() => toggleAmenity(amenity.id)}
                                        >
                                            {amenity.label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2">
                        {filters.location && (
                            <Badge variant="secondary" className="text-xs">
                                📍 {filters.location}
                            </Badge>
                        )}
                        {(filters.priceMin || filters.priceMax) && (
                            <Badge variant="secondary" className="text-xs">
                                💰 ₱{filters.priceMin || '0'} - ₱{filters.priceMax || '∞'}
                            </Badge>
                        )}
                        {filters.propertyType && (
                            <Badge variant="secondary" className="text-xs">
                                🏠 {filters.propertyType}
                            </Badge>
                        )}
                        {filters.genderPolicy && (
                            <Badge variant="secondary" className="text-xs">
                                👥 {filters.genderPolicy.replace('_', ' ')}
                            </Badge>
                        )}
                        {filters.amenities.map((amenityId) => {
                            const amenity = amenityOptions.find((a) => a.id === amenityId);
                            return amenity ? (
                                <Badge key={amenityId} variant="secondary" className="text-xs">
                                    ✨ {amenity.label}
                                </Badge>
                            ) : null;
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
