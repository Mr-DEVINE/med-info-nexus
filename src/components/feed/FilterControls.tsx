
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterControlsProps {
  onFilterChange: (filters: {
    sort: string;
    type: string;
    search: string;
    category: string;
  }) => void;
}

const FilterControls = ({ onFilterChange }: FilterControlsProps) => {
  const [sort, setSort] = useState("latest");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const handleSortChange = (value: string) => {
    setSort(value);
    updateFilters(value, type, search, category);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    updateFilters(sort, value, search, category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    updateFilters(sort, type, e.target.value, category);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    updateFilters(sort, type, search, value);
  };

  const updateFilters = (
    newSort: string,
    newType: string,
    newSearch: string,
    newCategory: string
  ) => {
    onFilterChange({
      sort: newSort,
      type: newType,
      search: newSearch,
      category: newCategory,
    });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search posts..."
            className="pl-10"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-3">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="clinical">Clinical</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
              <SelectItem value="bloodbank">Blood Bank</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full" value={type} onValueChange={handleTypeChange}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="doctor">Doctors</TabsTrigger>
          <TabsTrigger value="researcher">Researchers</TabsTrigger>
          <TabsTrigger value="bloodbank">Blood Banks</TabsTrigger>
          <TabsTrigger value="pharmaceutical">Pharmaceuticals</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default FilterControls;
