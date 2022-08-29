export function getLists() {
        return fetch('http://localhost:3000/lists')
            .then(result => {
                if (!result.ok) {
                    alert(Error(result.statusText))
                    return;
                }
              return result.json()
            })
    }

    export function addLists(list) {
        return fetch('http://localhost:3000/lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(list)
        })
            .catch(res => {
                if (!res.ok) {
                    alert(Error(res.statusText))
                }
            })
    }

    export function deleteLists(listId) {
        return fetch(`http://localhost:3000/lists/` + listId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        })
            .catch(res => {
                if (!res.ok) {
                    alert(Error(res.statusText))
                }
            })
    }