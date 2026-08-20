import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  Unsubscribe 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { MonthData } from '../types';

export function subscribeToUserMonths(
  userId: string,
  onUpdate: (months: Record<string, MonthData>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const collectionPath = `users/${userId}/months`;
  const monthsRef = collection(db, 'users', userId, 'months');

  return onSnapshot(
    monthsRef,
    (snapshot) => {
      const records: Record<string, MonthData> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.id && data.monthName) {
          records[data.id] = {
            id: data.id,
            monthName: data.monthName,
            incomes: Array.isArray(data.incomes) ? data.incomes : [],
            expenses: Array.isArray(data.expenses) ? data.expenses : [],
          };
        }
      });
      onUpdate(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
}

export async function saveMonthToFirestore(userId: string, month: MonthData): Promise<void> {
  const docPath = `users/${userId}/months/${month.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'months', month.id);
    await setDoc(docRef, {
      id: month.id,
      monthName: month.monthName,
      incomes: month.incomes || [],
      expenses: month.expenses || [],
      userId: userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteMonthFromFirestore(userId: string, monthId: string): Promise<void> {
  const docPath = `users/${userId}/months/${monthId}`;
  try {
    const docRef = doc(db, 'users', userId, 'months', monthId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function syncLocalMonthsToFirestore(
  userId: string, 
  localMonths: Record<string, MonthData>
): Promise<void> {
  const monthsRef = collection(db, 'users', userId, 'months');
  const collectionPath = `users/${userId}/months`;
  
  try {
    const snapshot = await getDocs(monthsRef);
    if (snapshot.empty) {
      // If user has no months stored in cloud yet, upload existing local months
      for (const month of Object.values(localMonths)) {
        await saveMonthToFirestore(userId, month);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}
