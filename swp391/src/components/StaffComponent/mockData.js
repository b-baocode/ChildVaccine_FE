export const childrenProfiles = [
    {
      child_id: 1,
      cus_id: 101,
      full_name: "Nguyễn Minh Anh",
      date_of_birth: "2020-03-15",
      gender: "Nữ",
      height: 98.5,
      weight: 15.8,
      blood_type: "O+",
      allergies: "Dị ứng với đậu phộng",
      health_note: "Tiền sử viêm phế quản"
    },
    {
      child_id: 2,
      cus_id: 102,
      full_name: "Trần Đức Minh",
      date_of_birth: "2021-07-22",
      gender: "Nam",
      height: 85.2,
      weight: 12.5,
      blood_type: "A+",
      allergies: "Không",
      health_note: "Khỏe mạnh"
    },
    {
      child_id: 3,
      cus_id: 103,
      full_name: "Lê Thu Hà",
      date_of_birth: "2019-11-30",
      gender: "Nữ",
      height: 102.3,
      weight: 16.7,
      blood_type: "B+",
      allergies: "Dị ứng với sữa bò",
      health_note: "Thiếu máu nhẹ, đang điều trị bổ sung sắt"
    },
    {
      child_id: 4,
      cus_id: 104,
      full_name: "Phạm Hoàng Nam",
      date_of_birth: "2022-01-05",
      gender: "Nam",
      height: 78.4,
      weight: 10.2,
      blood_type: "AB+",
      allergies: "Dị ứng với trứng",
      health_note: "Sinh non 2 tuần"
    },
    {
      child_id: 5,
      cus_id: 105,
      full_name: "Hoàng Mai Linh",
      date_of_birth: "2020-09-18",
      gender: "Nữ",
      height: 95.7,
      weight: 14.9,
      blood_type: "O-",
      allergies: "Không",
      health_note: "Có tiền sử co giật sốt"
    },
    {
      child_id: 6,
      cus_id: 106,
      full_name: "Vũ Đình Long",
      date_of_birth: "2021-04-25",
      gender: "Nam",
      height: 89.6,
      weight: 13.4,
      blood_type: "A+",
      allergies: "Dị ứng với hải sản",
      health_note: "Chậm tăng cân"
    }
  ];
  
  export const medicalRecords = [
    {
      child_id: 1,
      records: [
        {
          appointment_id: 101,
          staff_id: 201,
          date: "2024-03-10",
          symptoms: "Sốt nhẹ 37.8°C, ho khan",
          notes: "Tiêm vaccine MMR mũi 2, theo dõi 30 phút sau tiêm. Kê đơn thuốc hạ sốt."
        },
        {
          appointment_id: 102,
          staff_id: 202,
          date: "2024-01-15",
          symptoms: "Khám định kỳ, không có triệu chứng bất thường",
          notes: "Phát triển bình thường theo độ tuổi. Tư vấn chế độ dinh dưỡng."
        }
      ]
    },
    {
      child_id: 2,
      records: [
        {
          appointment_id: 201,
          staff_id: 203,
          date: "2024-03-05",
          symptoms: "Ho có đờm, sốt 38.5°C",
          notes: "Viêm đường hô hấp trên. Kê đơn kháng sinh và thuốc ho."
        },
        {
          appointment_id: 202,
          staff_id: 201,
          date: "2024-02-20",
          symptoms: "Khám định kỳ",
          notes: "Tiêm vaccine 5 trong 1 mũi 3. Phát triển tốt."
        }
      ]
    },
    {
      child_id: 3,
      records: [
        {
          appointment_id: 301,
          staff_id: 202,
          date: "2024-03-15",
          symptoms: "Thiếu máu, mệt mỏi",
          notes: "Xét nghiệm công thức máu. Kê đơn sắt và vitamin tổng hợp."
        },
        {
          appointment_id: 302,
          staff_id: 204,
          date: "2024-02-01",
          symptoms: "Khám định kỳ",
          notes: "Theo dõi tình trạng thiếu máu. Cân nặng tăng đều."
        }
      ]
    },
    {
      child_id: 4,
      records: [
        {
          appointment_id: 401,
          staff_id: 201,
          date: "2024-03-12",
          symptoms: "Tiêm chủng định kỳ",
          notes: "Tiêm vaccine Rotavirus. Phát triển bình thường."
        },
        {
          appointment_id: 402,
          staff_id: 203,
          date: "2024-02-15",
          symptoms: "Nổi mẩn đỏ sau ăn trứng",
          notes: "Dị ứng thực phẩm. Kê đơn thuốc kháng histamine."
        }
      ]
    },
    {
      child_id: 5,
      records: [
        {
          appointment_id: 501,
          staff_id: 202,
          date: "2024-03-08",
          symptoms: "Sốt cao 39°C, co giật",
          notes: "Co giật do sốt. Nhập viện theo dõi 24h. Kê đơn thuốc hạ sốt và chống co giật."
        },
        {
          appointment_id: 502,
          staff_id: 204,
          date: "2024-01-20",
          symptoms: "Khám định kỳ",
          notes: "Tiêm vaccine cúm mùa. Tăng trưởng tốt."
        }
      ]
    },
    {
      child_id: 6,
      records: [
        {
          appointment_id: 601,
          staff_id: 203,
          date: "2024-03-01",
          symptoms: "Chậm tăng cân, biếng ăn",
          notes: "Tư vấn dinh dưỡng. Kê đơn vitamin tổng hợp và men tiêu hóa."
        },
        {
          appointment_id: 602,
          staff_id: 201,
          date: "2024-02-10",
          symptoms: "Khám định kỳ",
          notes: "Tiêm vaccine viêm gan B mũi nhắc. Cần theo dõi cân nặng."
        }
      ]
    }
  ];
  
  // Thêm dữ liệu nhân viên y tế để hiển thị tên thay vì chỉ hiện ID
  export const staffData = {
    201: { name: "BS. Nguyễn Văn A", role: "Bác sĩ Nhi" },
    202: { name: "BS. Trần Thị B", role: "Bác sĩ Nhi" },
    203: { name: "BS. Lê Văn C", role: "Bác sĩ Nhi" },
    204: { name: "BS. Phạm Thị D", role: "Bác sĩ Nhi" }
  };