'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppState } from '@/context/app-state-provider';
import { states, districtsByState } from '@/lib/india-data';

export function MobileHeaderOptions() {
  const { 
    selectedState, 
    setSelectedState, 
    selectedDistrict, 
    setSelectedDistrict,
  } = useAppState();
  
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const firstDistrict = districtsByState[state]?.[0];
    if(firstDistrict) {
      setSelectedDistrict(firstDistrict);
    } else {
      setSelectedDistrict('');
    }
  }
  
  const districts = districtsByState[selectedState] || [];

  return (
    <div className="flex flex-col gap-4 p-2">
        <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger>
            <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
            {states.map((s) => (
                <SelectItem key={s} value={s}>
                {s}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!districts.length}>
            <SelectTrigger>
            <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
            {districts.map((d) => (
                <SelectItem key={d} value={d}>
                {d}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
    </div>
  );
}
