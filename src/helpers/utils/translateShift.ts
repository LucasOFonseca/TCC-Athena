import { ShiftType } from '@athena-types/shift';

export function translateShift(shiftType: ShiftType) {
  const translatedShift = {
    [ShiftType.morning]: 'Matutino',
    [ShiftType.afternoon]: 'Vespertino',
    [ShiftType.evening]: 'Noturno',
  };

  return translatedShift[shiftType];
}
