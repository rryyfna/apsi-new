import { getAvailableClasses, getEnrolledClasses } from '@/app/actions/mahasiswa';
import KrsClientPage from '@/app/components/mahasiswa/KrsClientPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function KrsPage() {
  const availableClasses = await getAvailableClasses();
  const enrolledData = await getEnrolledClasses();

  return (
    <KrsClientPage
      availableClasses={JSON.parse(JSON.stringify(availableClasses))}
      enrolledClasses={JSON.parse(JSON.stringify(enrolledData.enrolled || []))}
      mahasiswaName={enrolledData.mahasiswaName || 'Mahasiswa'}
      mahasiswaNim={enrolledData.mahasiswaNim || '-'}
    />
  );
}
