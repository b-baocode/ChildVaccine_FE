import sessionService from "./sessionService";

const API_BASE_URL = 'http://localhost:8080/vaccinatecenter'; // Port của Spring Boot

const childService = {
    addChildProfile: async (childData) => {
        try {
          const token = localStorage.getItem('authToken');
          const sessionData = await sessionService.checkSession();
    
          if (!sessionData || !sessionData.body.cusId) {
            throw new Error('Invalid session data');
          }
    
          const cusId = sessionData.body.cusId;
    
          const response = await fetch(`${API_BASE_URL}/childrens/${cusId}/add`, { // Use "children" (not "childrens") unless backend specifies otherwise
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(childData)
          });
    
          if (!response.ok) {
            let errorMessage = 'Failed to add child profile';
            try {
              // Attempt to parse the error response as JSON if possible
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
              // If JSON parsing fails, use the text response
              errorMessage = await response.text() || errorMessage;
            }
            throw new Error(errorMessage);
          }
    
          // Since the backend returns plain text ("Thêm trẻ thành công"), use response.text()
          const data = await response.text(); // Use text() instead of json() for plain text
          console.log('Child profile added:', data);
          return data; // Return the plain text response (e.g., "Thêm trẻ thành công")
        } catch (error) {
          console.error('Error in addChildProfile:', error);
          throw error;
        }
      },

      getCustomerChildren: async (cusId) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('🔍 Fetching children for customer:', cusId);
            
            const response = await fetch(`${API_BASE_URL}/childrens/getByCusID/${cusId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('No children found for customer:', cusId);
                    return [];
                }
                throw new Error('Failed to fetch children list');
            }

            const data = await response.json();
            console.log('👶 Children Data Response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching customer children:', error);
            throw error;
        }
    },

  getChildProfile: async (childId) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/childrens/${childId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch child profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching child profile:', error);
        throw error;
    }
  },

  getAllChildren: async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/childrens/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch children data');
        }

        return await response.json();
        } catch (error) {
            console.error('Error fetching children:', error);
            throw error;
        }
    },

    updateChildProfile: async (childId, childData) => {
        try {
          const token = localStorage.getItem('authToken');
          const sessionData = await sessionService.checkSession();
    
          if (!sessionData || !sessionData.cusId) {
            throw new Error('Invalid session data');
          }
    
          const response = await fetch(`${API_BASE_URL}/childrens/update/${childId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(childData)
          });
    
          if (!response.ok) {
            let errorMessage = 'Failed to update child profile';
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
              errorMessage = await response.text() || errorMessage;
            }
            throw new Error(errorMessage);
          }
    
          // Since the backend returns plain text ("Cập nhật thông tin trẻ thành công"), use response.text()
          const data = await response.text();
          console.log('Child profile updated:', data);
          return data; // Return "Cập nhật thông tin trẻ thành công"
        } catch (error) {
          console.error('Error in updateChildProfile:', error);
          throw error;
        }
      }
}

export default childService;